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
import Meteor,{ connectMeteor, Accounts } from 'react-native-meteor';


@connectMeteor
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {emailInput: props.initialEmail,passwordInput: props.initialPassword};
  }

  getMeteorData() {
      return { userId: Meteor.userId()};
  }
      
  _handlePress(sceneIndex) {
     this.props.navigator.push({id: sceneIndex,});
  }    
  
  _userRegister(){
      console.log('_userRegister ',this.state.emailInput,' ',this.state.passwordInput);
      Accounts.createUser({email: this.state.emailInput, password: this.state.passwordInput}, (err) => {
        if (err) {
           console.log({ error: err.reason, email: '', password: '' });
        } else {
          console.log({ error: null, email: '', password: '' });
        }
      });
  }
  
  _userLogin(){
      console.log('_userLogin ',this.state.emailInput,' ',this.state.passwordInput);
      Meteor.loginWithPassword(this.state.emailInput, this.state.passwordInput, (err) => {
        if (err) {
          console.log({ error: err.reason, email: '', password: '' });
        } else {
          console.log({ error: null, email: '', password: '' });
        }
      });
  }
  _userLogout(){
      console.log('_userLogout');
      Meteor.logout();
  }
    
  render() {
     const { userId } = this.data;
     
    var logoutBtn;
    if(userId){
         logoutBtn = <Button
            containerStyle={{margin: 10,padding:10, height:45, overflow:'hidden',borderColor:'white', borderRadius:2, backgroundColor: 'rgba(0,0,0,0)'}}
            style={{fontSize: 20, color: 'white'}}
            onPress={() => this._userLogout()}>
            Logout
        </Button>
    }
      
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
            ref={component => this._emailInput = component}
            style={styles.textEdit}
            autoCapitalize= 'none'
            keyboardType = 'email-address'
            onChangeText={(emailInput) => this.setState({emailInput})}
            placeholder="Email"
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
        
        {logoutBtn}

                        
      </View>
     
    );
  }
}

Login.propTypes = { initialEmail: React.PropTypes.string, initialPassword : React.PropTypes.string};
Login.defaultProps = { initialEmail: '', initialPassword:'' };

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