'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Alert,
  ToastAndroid  
} from 'react-native';
import Button from 'react-native-button';
import Meteor,{ connectMeteor, MeteorComplexListView } from 'react-native-meteor';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import CurrentSlogan from './CurrentSlogan';

@connectMeteor
export default class CurrentSloganTabView extends Component {
 


  getMeteorData() {
      const groupsHandle = Meteor.subscribe('groups');
      return { 
          groupsReady : groupsHandle.ready()
      };
  }  
    
  constructor(props) {
    super(props);
  }
       
  _handlePress() {
    this.props.navigator.replace({id: 1,});
  }      
  render() {
        
        var connectionStatus = Meteor.status().connected;
        if(!connectionStatus){
              ToastAndroid.show('No connection to server now', ToastAndroid.SHORT)            
        }
        
        var userGroups = Meteor.collection('Groups').find();

        var initialPageIndex = 0;
        if(this.props.groupId === ''){
            initialPageIndex = 0;
        }else{
            var privateGroupIndex = userGroups.findIndex((eachGroup) => {
                
                return eachGroup._id === this.props.groupId
                
            });
            
            //because public group is always the first index, we must plus one the index of the private group
            initialPageIndex = privateGroupIndex + 1;
        }  
                
        var allGroups = [];
        allGroups.push( <CurrentSlogan key={-1} groupId="" tabLabel='Public'/> );
        
        userGroups = userGroups.map(function(eachUserGroup,index){
            return <CurrentSlogan key={index} groupId={eachUserGroup._id} tabLabel={eachUserGroup.name}/>
        });
        allGroups = allGroups.concat(userGroups);
        
      
     return (
          <View  style={styles.mainContainer}>
            <Button
                containerStyle={{margin: 0,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress()}>
                Back
            </Button>
            <ScrollableTabView initialPage={initialPageIndex}>
                {allGroups}
            </ScrollableTabView>       
                      
          </View>
     )
  }
}

const styles = StyleSheet.create({ 
  mainContainer: {
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