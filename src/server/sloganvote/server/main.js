import { Meteor } from 'meteor/meteor';
var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

Meteor.startup(() => {
  // code to run on server at startup

});

Slogans = new Mongo.Collection('Slogans');
Elections = new Mongo.Collection('Elections');
Groups = new Mongo.Collection('Groups');

Meteor.methods({
   createNewGroup:function(groupName){
     Groups.insert({name:groupName,users:[Meteor.userId()],admins:[Meteor.userId()]});  
   },
   addUserToGroup:function(groupId,username){
     //If caller is user of the group
     if(Meteor.userId() && Groups.findOne({users: Meteor.userId()})){
        var targetUser = Meteor.users.findOne({username: username});
        Groups.update({_id:groupId},{$addToSet:{ users: targetUser._id}});
     }
   },
   removeUserFromGroup:function(groupId,userId){
     //If caller is admin of the group or caller tries to remove himself/herself from the group
     if( ( Meteor.userId() && Groups.findOne({admins: Meteor.userId()}) ) || (Meteor.userId() === userId) ){
        Groups.update({_id:groupId},{$pull:{ users: userId}});
     }       
   },
   addSlogan:function(sloganString,groupId){
       if(groupId){
         Slogans.insert({ slogan:sloganString, group:groupId});            
       }else{
         Slogans.insert({slogan:sloganString, group:''});  
       }

   },
   upVote:function(sloganId){
                     
       Slogans.update(
          {_id: sloganId},
          { $inc : {vote:1} } 
       )
   },
   callForVote:function(groupId){
       
       if(Elections.find({group:groupId, incomplete:true}).count() > 0 ){
           console.log('There is a election right now');
            return {line1:'There is a election right now',line2:''};
       }

       var previousValidElection = Elections.findOne( {group:groupId, validUntil:{ $gte: new Date() } } )
       if(previousValidElection){
           console.log('The previous election is still valid until: ', previousValidElection.validUntil);
        
         return {line1:'The previous election is still valid until:',line2: new Date(previousValidElection.validUntil).toTimeString() };
       }
              
       if(Slogans.find({group:groupId}).count() == 0){
           console.log('There should be at least one candidate to vote for');
            return {line1:'There should be at least one candidate to vote for',line2:''};           
       }
       

 
       //reset vote count
       Slogans.update({group:groupId}, {$set: {vote:0, elected: false}}, { multi: true })

       //http://stackoverflow.com/questions/7687884/add-10-seconds-to-a-javascript-date-object-timeobject?lq=1
       //vote finish time = now + 30 seconds
       var voteFinishTime = new Date();
       voteFinishTime.setSeconds(voteFinishTime.getSeconds() + 30);
                   
       var electId = Elections.insert({group:groupId,incomplete:true,createdAt:new Date(),voteFinishTime: voteFinishTime});

       
       if(groupId === ''){
          Streamy.broadcast('callForVote', { data: 'callForVote' });
       }else{
          targetGroup = Groups.findOne({_id: groupId});
          targetGroup.users.map(function(eachUserId){
             var s = Streamy.socketsForUsers(eachUserId);
             if(s){
               Streamy.emit('callForVote', { data: 'callForVote' }, s);                 
             }
          });
       }

       

       
       var job = new CronJob({
           cronTime: voteFinishTime,
           onTick: Meteor.bindEnvironment(function() {
               

               
               console.log('time is up!');
               

               //https://forums.meteor.com/t/how-do-fibers-and-meteor-asyncwrap-work/6087/24
               //Meteor.bindEnvironment is required because of below line         

               //the elect result is valid for 5 minutes
               var validUntil = new Date();
               validUntil.setMinutes(validUntil.getMinutes() + 1);               
               
               //find the slogan with the most vote, set it as elected
               var voteResult = Slogans.find({group: groupId}, {sort: {vote: -1}}).fetch();
               console.log('voteResult',voteResult);
               Slogans.update({_id: voteResult[0]._id},{$set: { elected:true}});
               
               //copy the election's slogans to election obj.
               var allSlogansResult = Slogans.find({group: groupId}, {sort: {vote: -1}}).fetch();
               Elections.update({_id: electId},{$set:{ incomplete:false, validUntil: validUntil, allSlogans: allSlogansResult} } );
               
               //remove all slogans from slogans collection of the group
               Slogans.remove({group: groupId});
               
               //Streamy.broadcast('callForVote', { data: 'voteEnd' });
           }),
           start: false,
           timeZone: 'Asia/Hong_Kong'
       });
       job.start();           
   }
    
});

Meteor.publish('slogans', function(groupId) {
  
  if(!this.userId){
    console.log('publish slogans.public');
    return Slogans.find({group:''});  
  }else{
    console.log('publish slogans.private',groupId);
    return Slogans.find({group:groupId});        
  }

});

Meteor.publish('elections', function(groupId) {

  if(!this.userId){
    console.log('publish elections.public');
    return Elections.find({group:''});
  }else{
    console.log('publish elections.private',groupId);
    return Elections.find({group:groupId});      
  }
 
});

Meteor.publish('groups',function(){
  console.log('publish groups ',this.userId);
  
  return Groups.find({ $or: [ { users: this.userId }, { admins: this.userId  } ] });
});

Meteor.publish('users',function(){
  if(this.userId){
    console.log('publish users ');
    return Meteor.users.find({ _id: { $ne: this.userId }});   
  }  

})