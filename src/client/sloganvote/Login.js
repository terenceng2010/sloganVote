'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ToastAndroid
} from 'react-native';
import Button from 'react-native-button';
import Meteor,{ connectMeteor, Accounts } from 'react-native-meteor';


@connectMeteor
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {userNameInput: props.initialUserName,passwordInput: props.initialPassword};
  }

  getMeteorData() {
      return { userId: Meteor.userId()};
  }
      
  _handlePress(sceneIndex) {
     this.props.navigator.push({id: sceneIndex,});
  }    
  
  _userRegister(){
      console.log('_userRegister ',this.state.userNameInput,' ',this.state.passwordInput);
      Accounts.createUser({username: this.state.userNameInput, password: this.state.passwordInput}, (err) => {
        if (err) {
           console.log({ error: err.reason, username: '', password: '' });
        } else {
          console.log({ error: null, username: '', password: '' });
           Meteor.loginWithPassword(this.state.userNameInput, this.state.passwordInput);
        }
      });
  }
  
  _userLogin(){
      console.log('_userLogin ',this.state.userNameInput,' ',this.state.passwordInput);
      Meteor.loginWithPassword(this.state.userNameInput, this.state.passwordInput, (err) => {
        if (err) {
          console.log({ error: err.reason, username: '', password: '' });
        } else {
          console.log({ error: null, username: '', password: '' });
        }
      });
  }
  _userLogout(){
      console.log('_userLogout');
      Meteor.logout();
  }
    
  render() {
     const { userId } = this.data;
 
     var connectionStatus = Meteor.status().connected;
     if (!connectionStatus) {
         ToastAndroid.show('No connection to server now', ToastAndroid.SHORT)
     }
            
    var logoutBtn;
    if(userId){
        return (
          <View style={styles.container}>
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress(1)}>
                Back
            </Button>
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress(5)}>
                My Groups
            </Button>
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress(5)}>
                Join Group
            </Button>                                              
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._userLogout()}>
                Logout
            </Button>               
          </View>  
        );
    }else{
        return (
        
        <View style={styles.container}>
            <Text  style={styles.welcome}>Register for private group vote</Text>
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress(1)}>
                Back
            </Button>
            <TextInput
                ref={component => this._userNameInput = component}
                style={styles.textEdit}
                autoCapitalize= 'none'
                onChangeText={(userNameInput) => this.setState({userNameInput})}
                placeholder="Username"
                placeholderTextColor='white'
            /> 

            <TextInput
                ref={component => this._passwordInput = component}
                style={styles.textEdit}
                secureTextEntry={true}
                onChangeText={(passwordInput) => this.setState({passwordInput})}
                
                placeholder="Password"
                placeholderTextColor='white'
            /> 
                    
            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._userRegister()}>
                Register
            </Button>

            <Button
                containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._userLogin()}>
                Login
            </Button>

                            
        </View>
        
        );        
    }
      

  }
}

Login.propTypes = { initialUserName: React.PropTypes.string, initialPassword : React.PropTypes.string};
Login.defaultProps = { initialUserName: '', initialPassword:'' };

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
  textEdit: {
     color:'white'
  }, 
  
});

//module.exports = SplashPage;