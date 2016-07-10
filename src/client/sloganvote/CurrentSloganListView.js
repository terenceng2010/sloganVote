'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Alert,
  ToastAndroid,
  ScrollView
} from 'react-native';
import Button from 'react-native-button';
import Meteor,{ connectMeteor, MeteorComplexListView } from 'react-native-meteor';

@connectMeteor
export default class CurrentSloganListView extends Component {

  getMeteorData() {
    
    const slogansHandle = Meteor.subscribe('slogans', this.props.groupId);
    const electionsHandle = Meteor.subscribe('elections', this.props.groupId);
    return {
      slogansReady: slogansHandle.ready(),
      electionsReady: electionsHandle.ready()
    };
  }
       
  constructor(props) {
    super(props);
  }
       
  _handlePress() {
    this.props.navigator.replace({id: 1,});
  }
      
  render() {
                
        var allGroupElections = [];        
        var groupElections = Meteor.collection('Elections').find({ group: this.props.groupId});
        var self = this;
        groupElections = groupElections.map(function(eachElection){
            
            var allSlogans;

            if(eachElection.allSlogans){
                allSlogans =  eachElection.allSlogans.map(function(eachSlogan){
                var sloganText;
                    if( eachSlogan.elected){
                        sloganText =  <Text style={{flex:0.7, backgroundColor:'#EA526F'}}>{eachSlogan.slogan} </Text>;
                    }else{
                        sloganText =  <Text style={{flex:0.7}}>{eachSlogan.slogan} </Text>;
                    }
                    
                    //https://facebook.github.io/react/tips/if-else-in-JSX.html 
                    return (
                        <View style={styles.renderRow}>
                            {sloganText}
                            <Button
                                containerStyle={{flex:0.3}}
                                style={{fontSize: 20, color: 'black' }}
                                >
                                
                                👍 ({eachSlogan.vote ? eachSlogan.vote : 0})
                            </Button>
                        </View>
                    );
                });
                
            }else{
                allSlogans = <Text>&nbsp;   </Text>;
            }

            
            return <View style={styles.card}>
                        <Text>{eachElection._id}</Text>
                        {allSlogans}
                   </View>    
        });
        
        allGroupElections = allGroupElections.concat(groupElections);
        
        //flexWrap
        //https://facebook.github.io/react-native/docs/layout-props.html
        allGroupElections.push( <View style={styles.card}>
                                    <Button
                                        containerStyle={{margin: 0,padding:10, height:75, overflow:'hidden', borderRadius:4, backgroundColor: '#EA526F',flex: 1,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'}}
                                        style={{fontSize: 72, color: 'white'}}
                                        onPress={() => this._handlePress()}>
                                        +
                                    </Button> 
                                   </View>  );
     return (
          <View  style={styles.mainContainer}>
          <ScrollView style={styles.scrollViewContainer}>
            <View style={{ flexDirection:'row',flexWrap:'wrap',width:350 }}>
                {allGroupElections}  
            </View>
          </ScrollView>
                       
          </View>
     )
  }
}

const styles = StyleSheet.create({ 
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollViewContainer:{
    
  },
  card:{
    borderWidth: 3,
    borderRadius: 3,
    borderColor: '#000',
    width: 150,
    height: 150,
    padding: 5,
    margin:5,
    
  },
  renderRow: {
    paddingTop:10,
    paddingBottom:10,
    justifyContent: 'space-between',
    alignItems: 'center',    
    flexDirection:'row'  
  },      
});