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
  Dimensions
} from 'react-native';
import Button from 'react-native-button';
import Meteor, { createContainer } from 'react-native-meteor';

export default class NewSlogan extends Component {
   

  constructor(props) {
    super(props);
    this.state = {text: props.initialText};
  }
  
    
  _handlePress() {
    this.props.navigator.push({id: 1,});
  }
  
  submitText(){
    Alert.alert(
            'Your new slogan is submited',
            this.state.text,
        );
    Meteor.call('addSlogan',this.state.text);
  }
  
  render() {
    return (
      <View  style={styles.mainContainer}>
        <View style={styles.toolbar}>
            <Button
                containerStyle={{margin: 0,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'royalblue'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this._handlePress()}>
                Back
            </Button> 
            <Text style={styles.welcome}>
            New Slogan
            </Text>        
            <Button
                containerStyle={{margin: 0,padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'royalblue'}}
                style={{fontSize: 20, color: 'white'}}
                onPress={() => this.submitText()}>
                Submit
            </Button>                
        </View>
        <View style={styles.content}>      
            <Image style={styles.contentBackgroundImage} resizeMode={Image.resizeMode.contain} source={require('./sign-post.png')}>
                <Text style={styles.inputText}>{this.state.text}</Text>
            </Image>
                  
        </View>
            <TextInput
                style={styles.textEdit}
                onChangeText={(text) => this.setState({text})}
                placeholder="What you gotta say?"
            /> 
        
      </View>
    );
  }
}

var width = Dimensions.get('window').width ; //full width
var height = Dimensions.get('window').height ; //full height   
NewSlogan.propTypes = { initialText: React.PropTypes.string };
NewSlogan.defaultProps = { initialText: '' };

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
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
    backgroundColor:'#81c04d',
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