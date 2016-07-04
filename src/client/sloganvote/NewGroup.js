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
export default class NewGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {groupNameInput: props.intialGroupName};
    
    this.renderGroup = this.renderGroup.bind(this);
  }


      
  _handlePress(sceneIndex,groupId) {
      
     this.props.navigator.push({id: sceneIndex, groupId: groupId||""});
  }    
  
  _createNewGroup(){
      console.log('_createNewGroup ',this.state.groupNameInput);
      Meteor.call('createNewGroup',this.state.groupNameInput)
  }

  renderGroup(group) {    
    return (
        <View style={styles.renderRow}>
            <Button
              onPress={() => this._handlePress(6, group._id)}
              style={{fontSize: 20, color: 'white',textAlign: 'center',}}
             >{group.name}
            </Button>
        </View>
    );
  }
        
  render() {        
        var myGroups;
            myGroups =
                <MeteorComplexListView
                                    elements={()=>{return Meteor.collection('Groups').find({})}}
                                    renderRow={this.renderGroup}
                                />             
        
        return (
        
        <View style={styles.container}>
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress(4)}>
                Back
            </Button>        
            <Text  style={styles.welcome}>New Group</Text>

            <TextInput
                ref={component => this._groupNameInput = component}
                style={styles.textEdit}
                onChangeText={(groupNameInput) => this.setState({groupNameInput})}
                placeholder="New Group Name"
                placeholderTextColor='white'
            /> 
                    
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._createNewGroup()}>
                Create
            </Button>
            
            <Text  style={styles.welcome}>My Groups</Text>
            {myGroups}                         
        </View>
        
        );        
  }
}

NewGroup.propTypes = { intialGroupName: React.PropTypes.string};
NewGroup.defaultProps = { intialGroupName: ''};

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