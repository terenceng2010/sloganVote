var finalhandler = require('finalhandler')
var http         = require('http')
var Router       = require('router')
var ecstatic = require("ecstatic");
var url = require('url');
var queryString = require('query-string');

var fileServer = ecstatic({root: "./public"});
var router = Router();


router.get('/slogans', function (req, res) {

  var parsed = queryString.parse(req._parsedUrl.search);

  
  if(parsed.lastReceivedTime){
    
    
   
    var list = getChangedSlogans(parsed.lastReceivedTime);
   if(list.length >0){
       
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); 
    res.end(sendSlogansWithServerTime(list));  
       
   }else{
   
       waitForChanges(parsed.lastReceivedTime,res);
   }
      

    
      
  }else{
      
    var list = [];
    
    for (var i=0; i < slogans.length; i++){
        
        list.push(slogans[i].sloganText);
    }
      
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); 
    res.end(sendSlogansWithServerTime(list));
  
  }
    
    

});

function getChangedSlogans(since){
    var found = [];
    
    for (var i=0; i < slogans.length; i++){
        
        if(slogans[i].createTime > since){
        
            found.push(slogans[i].sloganText);
        }
    }
    return found;
}

function sendSlogansWithServerTime(ary){
   
    var slogansWithServerTime=  {
        serverTime:Date.now(),
        slogans: ary
        
    };
    
    return JSON.stringify(slogansWithServerTime);
    
    
}

var changes = [];

function registerChange(title) {
  changes.push({title: title, time: Date.now()});
  waiting.forEach(function(waiter) {
      
    waiter.response.setHeader('Content-Type', 'application/json; charset=utf-8'); 
    waiter.response.end( sendSlogansWithServerTime(getChangedSlogans(waiter.since)) );    
   
  });
  waiting = [];
}

var waiting = [];

function waitForChanges(since,response) {
  var waiter = {since: since,response:response };
  waiting.push(waiter);
  setTimeout(function() {
    var found = waiting.indexOf(waiter);
    if (found > -1) {
      waiting.splice(found, 1);
        
    response.setHeader('Content-Type', 'application/json; charset=utf-8'); 
    response.end( sendSlogansWithServerTime([]));        

        
    }
  }, 90 * 1000);
}


router.put('/slogans/:newSlogan', function (req, res) {
    SloganManager.add(slogans,req.params.newSlogan);
    
    registerChange(req.params.newSlogan);
    
    res.end();
});

var server = http.createServer(function(req, res) {
    
  var preserveReq = req;
  var preserveRes = res;
  
  router(req, res, function(error,req,res){
  
      if(error){
        return;
      }else{
          //console.log(req);
          //console.log(res);
          fileServer(preserveReq, preserveRes);
      }
      
      
    
  });
  
  
})
var listenPort = 8000;
console.log("app now listens to port " + listenPort);
server.listen(listenPort);

var users = [];
var slogans = [];
var Slogan = function(){
   'use strict';
  
    var id =0;
    
    return function(sloganText){
      this.id = id++; 
      this.sloganText = sloganText;
      this.createTime = new Date().getTime();
      this.agree = 0;
      this.disagree =0;    
      
    };
}();



function sloganArrayStringBuilder(ary){
    var output = "";
    
    for (i =0; i < ary.length; i++){
        
        output = output + " " +ary[i].sloganText;
    }
    
    
    return ""+output+"";
}



var SloganManager = function(){
  'use strict';
   
    return {
      add: function(ary,txt){
       ary.push(new Slogan(txt));
       console.log('new slogan is pushed');
       console.log(ary);
      },
      upVote: function(ary,id){
        
        var result =  _.findWhere(ary,{id: id});
        if(result){
          
          var sloganIndex =   _.indexOf(ary,result);
          ary[sloganIndex].agree = ary[sloganIndex].agree + 1;
          
           console.log(ary[sloganIndex]);
          
          
          return "upvoted";
        }else{
          return "upvote fail";        
        }
       
        
        
      },
      downVote: function(ary,id){  
        
        var result =  _.findWhere(ary,{id: id});
        if(result){
          var sloganIndex =   _.indexOf(ary,result);
          ary[sloganIndex].disagree = ary[sloganIndex].disagree + 1;
          
          console.log(ary[sloganIndex]);
          
          
          return "downvoted";
        }else{
          return "downvote fail";
        }
        
        
         
      },
      checkEnoughVoteAndAgreeOverHalf: function(sloganAry,userCount,id){
        
         return "checked";
      }
    };
  
}();


users.push("terence");
users.push("suman");
users.push("tong");

var numberOfUser = users.length;

console.log("Current user: "+ numberOfUser);
console.log(users);


SloganManager.add(slogans,"如果命運能選擇");
SloganManager.add(slogans,"十字街口你我踏出的每步更瀟灑");




