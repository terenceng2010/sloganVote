import { Meteor } from 'meteor/meteor';
var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

Meteor.startup(() => {
  // code to run on server at startup

});

Slogans = new Mongo.Collection('Slogans');
Elections = new Mongo.Collection('Elections');

Meteor.methods({
   
   addSlogan:function(sloganString){
       Slogans.insert({slogan:sloganString});
   },
   upVote:function(sloganId){
       Slogans.update(
          {_id: sloganId},
          { $inc : {vote:1} } 
       )
   },
   callForVote:function(){

       if(Elections.find({incomplete:true}).count() > 0 ){
           console.log('There is a election right now');
            return {line1:'There is a election right now',line2:''};
       }
       var previousValidElection = Elections.findOne( { validUntil:{ $gte: new Date() } } )
       if(previousValidElection){
           console.log('The previous election is still valid until: ', previousValidElection.validUntil);
        
         return {line1:'The previous election is still valid until:',line2: new Date(previousValidElection.validUntil).toTimeString() };
       }
       
       var electId = Elections.insert({incomplete:true,createdAt:new Date()});
       
       Streamy.broadcast('callForVote', { data: 'callForVote' });
       
       //reset vote count
       Slogans.update({}, {$set: {vote:0}}, { multi: true })
       
       //http://stackoverflow.com/questions/7687884/add-10-seconds-to-a-javascript-date-object-timeobject?lq=1
       //vote finish time = now + 30 seconds
       var voteFinishTime = new Date();
       voteFinishTime.setSeconds(voteFinishTime.getSeconds() + 30);
       
       var job = new CronJob({
           cronTime: voteFinishTime,
           onTick: Meteor.bindEnvironment(function() {
               
               //the elect result is valid for 5 minutes
               var validUntil = new Date();
               validUntil.setMinutes(validUntil.getMinutes() + 5);
               
               console.log('time is up!');
               Streamy.broadcast('callForVote', { data: 'voteEnd' });

               //https://forums.meteor.com/t/how-do-fibers-and-meteor-asyncwrap-work/6087/24
               //Meteor.bindEnvironment is required because of below line         
               Elections.update({_id: electId},{$set:{ incomplete:false, validUntil: validUntil } } );
             
           }),
           start: false,
           timeZone: 'Asia/Hong_Kong'
       });
       job.start();           
   }
    
});

Meteor.publish('slogans.public', function() {
  console.log('publish slogans.public');
  return Slogans.find({});
});