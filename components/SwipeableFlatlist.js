import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'
import {SwipeListView} from 'react-native-swipe-list-view'
import db from '../config'
import {Icon, ListItem} from 'react-native-elements'

export default class SwipeableFlatlist extends React.Component{
    constructor(props){
        super(props);
        console.log('swipable flatlist:', this.props.allNotifications)
        this.state = ({
          
            allNotifications : this.props.allNotifications
        })
    }

    onSwipeValueChange = (swipeData) => {
      var allNotifications = this.state.allNotifications
      const {key, value} = swipeData
      console.log("KEY: ", key)
      if(value < -Dimensions.get('window').width){
        //made a copy of the array
        var newData = [...allNotifications];
        //passing the notification which has been swiped.
        this.updateStatus(allNotifications[key]);
        //.splice is used to add or remove something from an array.
        //here it will remove this current index, and 1 represents the value to delete.
        //will remove it from the array
        newData.splice(key,1);
        this.setState({
          allNotifications : newData
        })
        
      }
    }

    updateStatus(notification){
      db.collection('Notifications').doc(notification.doc_id)
      .update({notificationStatus: "read"})
    }

    keyExtractor = (item, index) => index.toString()

    
    renderItem = ({item,i}) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
          {<Icon name = "book" type = "font-awesome" color = '#696969'/>}  
        </ListItem.Content>
      </ListItem>
      
    )
  }

  renderHiddenItem(){
    return(
    <View style = {styles.rowBack}>
      <View style = {[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style = {styles.backTextWhite}>
          Mark as read
        </Text>

      </View>

    </View>)
  }

  render(){
    return(
      <View style = {styles.container}>
        <SwipeListView
        disableRightSwipe
        data = {this.state.allNotifications}
        renderItem = {this.renderItem}
        renderHiddenItem = {this.renderHiddenItem}
        rightOpenValue = {-Dimensions.get('window').width}
        onSwipeValueChange = {this.onSwipeValueChange}
        keyExtractor = {this.keyExtractor}
        />
      </View>
    )
  }
}



const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1
    },
    backTextWhite: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 15,
      textAlign: "center",
      alignSelf: "flex-start"
    },
    rowBack: {
      alignItems: "center",
      backgroundColor: "#29b6f6",
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 15
    },
    backRightBtn: {
      alignItems: "center",
      bottom: 0,
      justifyContent: "center",
      position: "absolute",
      top: 0,
      width: 100
    },
    backRightBtnRight: {
      backgroundColor: "#29b6f6",
      right: 0
    }
  });