'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import Button from 'react-native-button';
import * as Animatable from 'react-native-animatable';

export default class SplashScreen extends Component {

  _handlePress(sceneIndex) {
    
    this.refs.whole_box.transitionTo({opacity:0},0);
    
    this.refs.box_left.fadeOutLeft(500);
    this.refs.box_right.fadeOutRight(500);
    this.refs.box_top.fadeOutUp(500).then( () => { this.refs.thunder.bounceOutDown(100).then( () => { this.props.navigator.push({id: sceneIndex,}); } ); });
      
    
  }    
    
  render() {
    return (
     
      <View style={styles.container}>
        <View style={styles.logoWrapper}>

      
            <Animatable.Image ref='box_top'  source={require('./assets/box_top.png')} style={styles.logoBoxTop} />   
            <Animatable.Image ref='box_left'  source={require('./assets/box_left.png')} style={styles.logoBoxLeft} />   
            <Animatable.Image ref='box_right' source={require('./assets/box_right.png')} style={styles.logoBoxRight} /> 
            
            <Animatable.Image ref='whole_box' animation="zoomInUp" source={require('./assets/votebox.png')} style={styles.logoVoteBox} />   
            <Animatable.Image ref='thunder' animation="bounceInDown" delay={300} source={require('./assets/thunder_small.png')} style={styles.logoThunder} />

           
                                                         
        </View>
        <Text style={styles.welcome}>
          Votetage
        </Text>
        
        <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._handlePress(2)}>
            New Vote
        </Button>
                
        <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._handlePress(3)}>
            Previous Vote & Candidate
        </Button>

        <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._handlePress(4)}>
            Register / Login
        </Button>
                
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems:'flex-end',
    backgroundColor: 'black',
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    color:'#25CED1',
    fontFamily:'aldrich',
    marginLeft: 10,
    marginRight: 15,
    marginBottom:10   
  },
  logoWrapper:{

  },
  logoVoteBox:{
     position: 'absolute',
     top:-250,
     left:-280
  },
  logoThunder:{
     position: 'absolute',
     top:-250,
     left:-215
  },
  logoBoxTop:{
       position: 'absolute',
       opacity:0,
       top:-250,
       left:-275,
       width:195,
       height:100       
  },
  logoBoxLeft:{
       position: 'absolute',
       opacity:0,
       top:-200,
       left:-275,
       width:100,
       height:120     
  },
  logoBoxRight:{
       position: 'absolute',
       opacity:0,
       top:-200,
       left:-180,
       width:100,
       height:120       
  }
  
});

//module.exports = SplashPage;