import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Slogans = new Mongo.Collection('Slogans');

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
       Streamy.broadcast('callForVote', { data: 'callForVote' });
   }
    
});

Meteor.publish('slogans.public', function() {
  console.log('publish slogans.public');
  return Slogans.find({});
});