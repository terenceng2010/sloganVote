'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  Dimensions,
  Picker
} from 'react-native';
import Button from 'react-native-button';
import Meteor, { connectMeteor, createContainer } from 'react-native-meteor';

@connectMeteor
export default class NewSlogan extends Component {
   

  constructor(props) {
    super(props);
    this.state = {text: props.initialText, group: props.initialGroup};
  }

  getMeteorData() {
      const groupsHandle = Meteor.subscribe('groups');
      return { 
          groupsReady : groupsHandle.ready()
      };
  }  
    
  _handlePress() {
    this.props.navigator.push({id: 1,});
  }
  
  submitText(){
    Alert.alert(
            'Your new slogan is submited',
            this.state.text,
        );
    Meteor.call('addSlogan',this.state.text, this.state.group);
    
    //set text to '' so that no text is displayed on the sign post
    //http://stackoverflow.com/questions/30852251/react-native-this-setstate-not-working
    this.setState({text:''});
    
    //setNativeProps to clear TextInput value
    //https://facebook.github.io/react-native/docs/direct-manipulation.html
    this._textInput.setNativeProps({text: ''});
  }
  
  render() {
    
    const { groupsReady } = this.data;
    
    var loggedIn
    if(Meteor.userId() && groupsReady){
        var userGroups = Meteor.collection('Groups').find();
        
        var allGroups = [];
        allGroups.push( <Picker.Item key={0} label="Public" value="" /> );
        
        userGroups = userGroups.map(function(eachUserGroup,index){
            return <Picker.Item key={index} label={eachUserGroup.name} value={eachUserGroup._id} />
        });
        allGroups = allGroups.concat(userGroups);
        
        loggedIn = <Picker selectedValue={this.state.group} onValueChange={(groupId) => this.setState({ group: groupId }) }>
                         {allGroups}        
                    </Picker>  
    }else{
        loggedIn = <Text> </Text>
    }
    return (
      <View  style={styles.mainContainer}>
        <View style={styles.toolbar}>
            <Button
                containerStyle={{margin: 0,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress()}>
                Back
            </Button> 
            <Text style={styles.welcome}>
            New Vote
            </Text>        
            <Button
                containerStyle={{margin: 0,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this.submitText()}>
                Submit
            </Button>                
        </View>
        <TextInput
            ref={component => this._textInput = component}
            style={styles.textEdit}
            onChangeText={(text) => this.setState({text})}
            placeholder="What is the vote option?"
        /> 
        {loggedIn}
      </View>
    );
  }
}

var width = Dimensions.get('window').width ; //full width
var height = Dimensions.get('window').height ; //full height   
NewSlogan.propTypes = { initialText: React.PropTypes.string, initialGroup: React.PropTypes.string };
NewSlogan.defaultProps = { initialText: '', initialGroup: '' };

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor:'#FCEADE'
    },
    content:{
        flex:1,
        flexDirection:'row' ,
 
    },
    contentBackgroundImage:{
        flex: 1,
        height:300
    },
    inputText:{
      position:'absolute',
      width: width* 0.7,
      top:height * 0.1,
      left:width * 0.15,
      fontSize:20  
    },
  toolbar: {
    backgroundColor:'#25CED1',
    paddingTop:10,
    paddingBottom:10,
    justifyContent: 'space-between',
    alignItems: 'center',    
    flexDirection:'row'   
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color:'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textEdit: {
    height: 40, 
    borderColor: 'grey', 
    backgroundColor: 'white',
    borderWidth: 1
  },  
});

//module.exports = SplashPage;