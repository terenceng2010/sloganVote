'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Button from 'react-native-button';

export default class SplashScreen extends Component {

  _handlePress(sceneIndex) {
    this.props.navigator.push({id: sceneIndex,});
  }    
    
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Slogan Vote!
        </Text>
        <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._handlePress(2)}>
            What is the next slogan?
        </Button>
                
        <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._handlePress(3)}>
            View current slogan
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCEADE',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color:'#25CED1'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

//module.exports = SplashPage;