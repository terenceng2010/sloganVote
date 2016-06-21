'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,  
} from 'react-native';
import Button from 'react-native-button';
import Meteor,{ connectMeteor, Accounts, MeteorComplexListView } from 'react-native-meteor';


@connectMeteor
export default class ViewGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {groupNameInput: props.intialGroupName};
  }

  getMeteorData() {
      const groupsHandle = Meteor.subscribe('groups');
      const usersHandle  = Meteor.subscribe('users');
      return { 
          userId: Meteor.userId(),
          groupsReady : groupsHandle.ready(),
          usersReady  : usersHandle.ready()
      };
  }
      
  _handlePress(sceneIndex) {
     this.props.navigator.push({id: sceneIndex,});
  }    
  
  renderGroup(group) {
    
    var users = "";
    group.users.map(function(eachUserId){
        let userObj = Meteor.collection('users').find({_id:eachUserId});
        console.log('userObj',userObj[0]);
        users += userObj[0].username;
      
    })
    
    var admins = "";
    group.admins.map(function(eachUserId){
        let userObj = Meteor.collection('users').find({_id:eachUserId});
        console.log('userObj',userObj);
        admins += userObj[0].username;

    })    
    return (
        <View style={styles.renderRow}>
        
            <Text style={{fontSize: 20, color: 'white',textAlign: 'center',}}>{group.name}</Text>
            <Text style={{fontSize: 20, color: 'white',textAlign: 'center',}}>{users}</Text>
            <Text style={{fontSize: 20, color: 'white',textAlign: 'center',}}>{admins}</Text>
                                    
        </View>
    );
  }
        
  render() {
     const { userId,groupsReady,usersReady } = this.data;
        
        var myGroups;
        console.log('groupId', this.props.groupId);
        var groupId = this.props.groupId;
        if (!groupsReady && !usersReady) {
            myGroups =
                <View>
                    <Text  style={{fontSize: 20, color: 'white',textAlign: 'center',}}>Loading...</Text>
                </View>
            
        }else{
            
            myGroups =
                <MeteorComplexListView
                                    elements={()=>{return Meteor.collection('Groups').find({_id: groupId})}}
                                    renderRow={this.renderGroup}
                                />             
        }  
        return (
        
        <View style={styles.container}>
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress(5)}>
                Back
            </Button>
            {myGroups}
                                     
        </View>
        
        );        
  }
}

ViewGroup.propTypes = { intialGroupName: React.PropTypes.string};
ViewGroup.defaultProps = { intialGroupName: ''};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textEdit: {
     color:'white'
  } 
});

//module.exports = SplashPage;