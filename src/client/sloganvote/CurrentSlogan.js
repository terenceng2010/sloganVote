'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';
import Button from 'react-native-button';
import Meteor,{ connectMeteor, MeteorComplexListView } from 'react-native-meteor';

@connectMeteor
export default class CurrentSlogan extends Component {
 


  getMeteorData() {
    const slogansHandle = Meteor.subscribe('slogans.public');
    return {
      slogansReady: slogansHandle.ready()
    };
  }
    
  constructor(props) {
    super(props);
    
      /*var slogans = Meteor.collection('Slogans').find();
      console.log(slogans);
      var slogansStringArray = [];
      slogans.map(function(eachSlogan){
          slogansStringArray.push(eachSlogan.slogan);
      })     
      var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
           
    this.state = {
      dataSource: ds.cloneWithRows(slogansStringArray),
    };*/

  }
   
     
  _handlePress() {
    this.props.navigator.push({id: 1,});
  }

  renderRow(slogan) {
    return (
      <Text>{slogan.slogan}</Text>
    );
  }
    
  render() { 
    const { slogansReady } = this.data;
    
    if (!slogansReady) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }     
    
    return (
      <View style={styles.container}>
         <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'royalblue'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._handlePress()}>
            Back
        </Button>     
        
        <MeteorComplexListView
          style={styles.container}
          elements={()=>{return Meteor.collection('Slogans').find()}}
          renderRow={this.renderRow}
        />  
        
           
      </View>
    );
  }
}

const styles = StyleSheet.create({
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