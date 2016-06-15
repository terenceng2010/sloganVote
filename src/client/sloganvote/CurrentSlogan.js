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

    //http://stackoverflow.com/questions/29532926/this-value-is-null-in-function-react-native
    //binding function
    this.renderRow = this.renderRow.bind(this);
    this._handleUpVote = this._handleUpVote.bind(this);
        

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
  }
  
  renderRow(slogan) {
    return (
        <View style={styles.renderRow}>
            <Text style={{flex:0.8}}>{slogan.slogan} </Text>
            <Button
                containerStyle={{flex:0.2}}
                style={{fontSize: 20, color: 'black' }}
                onPress={() => this._handleUpVote(slogan._id) }>
                👍 ({slogan.vote})
            </Button>
        </View>
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
          elements={()=>{return Meteor.collection('Slogans').find({}, {sort: {vote: -1}})}}
          renderRow={this.renderRow}
        />  
        
           
      </View>
    );
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