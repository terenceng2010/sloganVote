'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Alert
} from 'react-native';
import Button from 'react-native-button';
import Meteor,{ connectMeteor, MeteorComplexListView } from 'react-native-meteor';
import Sound from 'react-native-sound';
import moment from 'moment';

@connectMeteor
export default class CurrentSlogan extends Component {
 


  getMeteorData() {
    
    const slogansHandle = Meteor.subscribe('slogans', this.props.groupId);
    const electionsHandle = Meteor.subscribe('elections', this.props.groupId);
    return {
      slogansReady: slogansHandle.ready(),
      electionsReady: electionsHandle.ready()
    };
  }
    
  constructor(props) {
    super(props);

    //http://stackoverflow.com/questions/29532926/this-value-is-null-in-function-react-native
    //binding function
    this.renderRow = this.renderRow.bind(this);
    this.renderLastElectionRow = this.renderLastElectionRow.bind(this);
    this._handleUpVote = this._handleUpVote.bind(this);
    this.state = {timeLeftToVote: 0};

  }
  
  componentDidMount(){
      //this works. But it seems to be a poor implementation...
      //http://stackoverflow.com/questions/31963803/create-timer-with-react-native-using-es6
      var intervalId = setInterval(() =>{
          var ongoingElection = Meteor.collection('Elections').findOne({incomplete:true});
           if( ongoingElection ){
            var secondsLeftToVoteFinish = moment(new Date(ongoingElection.voteFinishTime)).diff(new Date(),'seconds');
            this.setState({timeLeftToVote: secondsLeftToVoteFinish })
          }
      },1000);
      this.setState({intervalId: intervalId});
  } 
  
  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }
  
  _handlePress() {
    this.props.navigator.push({id: 1,});
  }

  _handleUpVote(sloganId) {
    /*Alert.alert(
            'The slogan is upvoted!',
            sloganId,
        );*/
    Meteor.call('upVote',sloganId);
    var drum = new Sound('drum.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
        } else { // loaded successfully
            //console.log('duration in seconds: ' + initialDrum.getDuration() + 'number of channels: ' + initialDrum.getNumberOfChannels());
            drum.play(function(){
                // Release the audio player resource
                drum.release();
            });
        }
    }); 
        
  }
  
  _handleCallForVote(groupId) {
    console.log('_handleCallForVote',groupId);
    /*Alert.alert(
            'The slogan is upvoted!',
            sloganId,
        );*/
    Meteor.call('callForVote',groupId,function(err,result){
        if(result){
            Alert.alert(result.line1,result.line2);
        }
    });
  }
    
  renderRow(slogan) {
    
    var sloganText;
    if( slogan.elected){
        sloganText =  <Text style={{flex:0.7, backgroundColor:'#EA526F'}}>{slogan.slogan} </Text>;
    }else{
        sloganText =  <Text style={{flex:0.7}}>{slogan.slogan} </Text>;
    }
    
    //https://facebook.github.io/react/tips/if-else-in-JSX.html 
    return (
        <View style={styles.renderRow}>
            {sloganText}
            <Button
                containerStyle={{flex:0.3}}
                style={{fontSize: 20, color: 'black' }}
                onPress={() => this._handleUpVote(slogan._id) }>
                👍 ({slogan.vote ? slogan.vote : 0})
            </Button>
        </View>
    );
  }

  renderLastElectionRow(slogan) {
    
    var sloganText;
    if( slogan.elected){
        sloganText =  <Text style={{flex:0.7, backgroundColor:'#EA526F'}}>{slogan.slogan} </Text>;
    }else{
        sloganText =  <Text style={{flex:0.7}}>{slogan.slogan} </Text>;
    }
    
    //https://facebook.github.io/react/tips/if-else-in-JSX.html 
    return (
        <View style={styles.renderRow}>
            {sloganText}
            <Button
                containerStyle={{flex:0.3}}
                style={{fontSize: 20, color: 'black' }}
                onPress={() => this._handleUpVote(slogan._id) }>
                
                👍 ({slogan.vote ? slogan.vote : 0})
            </Button>
        </View>
    );
  }
  
  renderCandidateRow(slogan) {
    
    var sloganText;
    if( slogan.elected){
        sloganText =  <Text style={{flex:0.7, backgroundColor:'#EA526F'}}>{slogan.slogan} </Text>;
    }else{
        sloganText =  <Text style={{flex:0.7}}>{slogan.slogan} </Text>;
    }
    
    //https://facebook.github.io/react/tips/if-else-in-JSX.html 
    return (
        <View style={styles.renderRow}>
            {sloganText}
        </View>
    );
  }
      
  render() { 
    const { slogansReady,electionsReady } = this.data;
    
    if (!slogansReady) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }     
    
    var ongoingElection = Meteor.collection('Elections').findOne({ group: this.props.groupId, incomplete:true});
    if( ongoingElection ){
    //if there is an on-going
                
        return (
            <View style={styles.container}>
            
                <Button
                    containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={() => this._handlePress()}
                    >
                    Time Remain ({this.state.timeLeftToVote})
                </Button>     
                
                <MeteorComplexListView
                style={styles.container}
                elements={()=>{return Meteor.collection('Slogans').find({group: this.props.groupId}, {sort: {slogan: -1}})}}
                renderRow={this.renderRow}
                />                  
            </View>
        );
    }else{
        
        var allSlogans;
        if(Meteor.collection('Elections').findOne( {group: this.props.groupId} ) ){
            
            //an incomplete elections does not have allslogans. So we need to find with incomplete equals false
            allSlogans =
                <MeteorComplexListView
                    style={styles.container}
                    elements={ ()=>{ if( !Meteor.collection('Elections').findOne( {group: this.props.groupId, incomplete:true} ) ) { 
                                      return Meteor.collection('Elections').find({ group: this.props.groupId, incomplete:false}, {sort: {createdAt: -1}})[0].allSlogans}
                                      else{ return Meteor.collection('Slogans').find({group: this.props.groupId}, {sort: {slogan: -1}}) }
                                    }
                              }
                    renderRow={this.renderLastElectionRow}
                />  ;
        }else{
            allSlogans = <Text>No Previous Election.</Text>
        }
        
        var nextVoteCandidates;
        if( Meteor.collection('Slogans').find({}).length >0 ){
            nextVoteCandidates =  <MeteorComplexListView
                    style={styles.container}
                    elements={()=>{return Meteor.collection('Slogans').find({group: this.props.groupId}, {sort: {vote: -1}})}}
                    renderRow={this.renderCandidateRow}
                />  
        }else{
            nextVoteCandidates = <Text>No next vote candidate yet.</Text>
        }
        
        return (
            <View style={styles.container}>    
                <Text>Current Vote Result</Text>
                {allSlogans}
                <Text>Next Vote Candidate</Text>
                {nextVoteCandidates}
                <Button
                    containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={() => this._handleCallForVote( this.props.groupId )}>
                    Call For Vote!
                </Button>        
                
            </View>
        );    
            
        
    }
  }
}

const styles = StyleSheet.create({
  renderRow: {
    paddingTop:10,
    paddingBottom:10,
    justifyContent: 'space-between',
    alignItems: 'center',    
    flexDirection:'row'  
  },    
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

//module.exports = SplashPage;