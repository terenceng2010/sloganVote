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

import SplashScreen from './SplashScreen';
import CurrentSlogan from './CurrentSlogan';
import NewSlogan from './NewSlogan';

Meteor.connect('ws://192.168.1.82:3000/websocket');//do this only once
Meteor.ddp.on("streamy", message => {
    //console.log('a streamy msg', message.data);
    if(message.data === 'callForVote'){
        Alert.alert(
                'Call for Vote!',
                'Call for Vote!',
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

