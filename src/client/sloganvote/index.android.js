/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Alert
} from 'react-native';

import Meteor, { createContainer } from 'react-native-meteor';
import Sound from 'react-native-sound';

import SplashScreen from './SplashScreen';
import CurrentSlogan from './CurrentSlogan';
import NewSlogan from './NewSlogan';
import Login from './Login';
import NewGroup from './NewGroup';
import ViewGroup from './ViewGroup';

Meteor.connect('ws://192.168.1.82:3000/websocket');//do this only once
Meteor.ddp.on("streamy", message => {
    //console.log('a streamy msg', message.data);
    if(message.data === 'callForVote'){
        Alert.alert(
                'Call for Vote!',
                '要求表決!',
            );  
            
    var initialDrum = new Sound('initialdrum.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
        } else { // loaded successfully
            //console.log('duration in seconds: ' + initialDrum.getDuration() + 'number of channels: ' + initialDrum.getNumberOfChannels());
            initialDrum.play(function(){
                
                //Release the audio player resource
                initialDrum.release();
            });
        }
    });            
   }
   
   if(message.data === 'voteEnd'){
        Alert.alert(
                'Vote ends',
                'Vote ends',
            ); 
   }
});
class sloganvote extends Component {

  _renderScene(route, navigator) {
    if (route.id === 1) {
      return <SplashScreen navigator={navigator} />
    }
    if (route.id === 2) {
      return <NewSlogan navigator={navigator} />
    }
    if (route.id === 3) {
      return <CurrentSlogan navigator={navigator} />
    }
    if (route.id === 4){
      return <Login navigator={navigator} />
    }
    if (route.id === 5){
      return <NewGroup navigator={navigator} />
    }
    if (route.id === 6){
      console.log(route.groupId)
      return <ViewGroup groupId={route.groupId} navigator={navigator} />
    }    
  }
        
  render() {
    return (
      <Navigator
        initialRoute={{id: 1, }}
        renderScene={this._renderScene} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

AppRegistry.registerComponent('sloganvote', () => sloganvote);

