import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, FlatList} from 'react-native';
import db from '../config';
import {ListItem, Icon} from 'react-native-elements'
import MyHeader from '../components/MyHeader'
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';
import SwipeableFlatlist from '../components/SwipeableFlatlist'

export default class Notifications extends React.Component{
  constructor(){
    super();
    this.state = {
      userId : firebase.auth().currentUser.email,
      allNotifications : []
    }
  }

  getNotifications = () => {
      console.log("this is the user id " + this.state.userId)
    db.collection('Notifications').where('targetedUserId', '==', this.state.userId)
    .where('notificationStatus', '==', 'unread')
    .onSnapshot((data)=>{
      var notificationList = []
      data.docs.map(doc => {
        var notification = doc.data()
        console.log(notification + " this is the notification.")
        notification['doc_id'] = doc.id
        notificationList.push(notification)
        })

      //console.log("HERE " + itemList)
      this.setState({
        allNotifications : notificationList
      })
      console.log("notification screen:" + this.state.allNotifications)

      //whenever want to put it in a flatlist, use map()
    })
  }

  componentDidMount(){
    this.getNotifications();
    //console.log("This is the list:" + this.state.requestedItemList)
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({item,i}) => {
    return (

      /*
      <ListItem
      key = {i}
      title = {item.itemName}
      subtitle = {item.reason}
      titleStyle = {{color : 'black', fontWeight : 'bold'}}
      rightElement = {<TouchableOpacity style = {styles.button}>
        <Text style = {{color : 'white'}}> View </Text>
      </TouchableOpacity>}
      bottomDivider
      />
*/
      
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
          {<Icon name = "item" type = "font-awesome" color = '#696969'/>}  
        </ListItem.Content>
      </ListItem>
      
    )
  }
    render(){
        return(
          <View style = {{flex : 1}}>
            <MyHeader
            title = 'Notifications'
            navigation = {this.props.navigation}
            />

            <View style = {{flex:1}}>
                {this.state.allNotifications.length === 0
                ?(
                    <View style = {styles.Subtitle}>
                        <Text style = {{fontSize : 20}}>No notifications</Text>
                    </View>
                )
                : (
                    <SwipeableFlatlist
                    allNotifications = {this.state.allNotifications}
                    />
                )}
            </View>
            

          </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })

