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
    this.state = {userNameInput: props.initialUserName};
  
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
  

  _addUserToGroup(groupId){
    Meteor.call('addUserToGroup',groupId,this.state.userNameInput);
  }
  
  
  renderGroup(group) {
 
     var admins = group.admins.map(function(eachUserId,index){
        let userObj = Meteor.collection('users').find({_id:eachUserId});
        console.log('userObj',userObj);
        return <View  key={index}><Text style={{fontSize: 20, color: 'white',textAlign: 'center',}}> {userObj[0].username} (admin) </Text></View>
    });
       
    var users = group.users.map(function(eachUserId,index){
        let userObj = Meteor.collection('users').find({_id:eachUserId});
        
        if(!userObj){
            return <Text style={{fontSize: 20, color: 'white',textAlign: 'center', flex:0.5}}> No User</Text>
        }
        
        console.log('userObj',userObj[0]);
        return <View key={index} style={{flexDirection:'row'}}>
                 <Text style={{fontSize: 20, color: 'white',textAlign: 'center', flex:0.5}}> {userObj[0].username}</Text>
                 <Button
                    containerStyle={{ height:20, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)', flex:0.5}}
                    style={{fontSize: 20, color: '#EA526F'}}
                    onPress={() =>  Meteor.call('removeUserFromGroup',group._id ,eachUserId) }>
                    -
                 </Button>                 
               </View>
      
    });
    

    
    return (
        <View style={styles.renderRow}>
        
            <Text style={styles.welcome}>{group.name}</Text>
            {admins}
            {users}

                                    
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

            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._deleteGroup(groupId)}>
                Delete this group
            </Button>
                        
            {myGroups}

            <TextInput
                ref={component => this._userNameInput = component}
                style={styles.textEdit}
                autoCapitalize= 'none'
                onChangeText={(userNameInput) => this.setState({userNameInput})}
                placeholder="Username"
                placeholderTextColor='white'
            />             
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._addUserToGroup(groupId)}>
                Add User to this group
            </Button>            
                                     
        </View>
        
        );        
  }
}

ViewGroup.propTypes = { initialUserName: React.PropTypes.string};
ViewGroup.defaultProps = { initialUserName: ''};

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