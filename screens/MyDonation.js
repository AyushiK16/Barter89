import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, FlatList} from 'react-native';
import db from '../config';
import {ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader'
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';

export default class MyDonation extends React.Component{
  constructor(){
    super();
    this.state = {
      userId : firebase.auth().currentUser.email,
      allDonations : [],
      donarName: ''
    }
  }

  getItemList = () => {
    db.collection('AllDonations').where('donarId', '==', this.state.userId)
    .onSnapshot((data)=>{
      var itemList = []
      data.docs.map((doc)=>{
        var donation = doc.data()
        donation['doc_id'] = doc.id
        itemList.push(donation);
      })
      //console.log("HERE " + itemList)
      this.setState({
        allDonations : itemList
      })
      console.log("function:" + this.state.allDonations)

      //whenever want to put it in a flatlist, use map()
    })
  }

  sendItem(itemDetails){
    if(itemDetails.requestStatus === "Item Sent"){
      var requestStatus = "Donar Interested"
      db.collection('AllDonations').doc(itemDetails.doc_id).update({
        requestStatus : 'Donar Interested'
      })
      this.sendNotification(itemDetails, requestStatus);
    }

    else {
      var requestStatus = "Item Sent"
      db.collection('AllDonations').doc(itemDetails.doc_id).update({
        requestStatus : 'Item Sent'
      })
      this.sendNotification(itemDetails, requestStatus)
    }
  }

  sendNotification(itemDetails, requestStatus){
    var requestId = itemDetails.requestId
    var donarId = itemDetails.donarId
    db.collection('Notifications').where("requestId", "==", requestId)
    .where("donarId", "==", donarId)
    .get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var message = ''
        if(requestStatus === "Item Sent"){
          message = this.state.donarName + ' sent you the item.' 
        }
        else{
          message = this.state.donarName + ' has shown interest in donating the item.'
        }
        db.collection('Notifications').doc(doc.id).update({
          message : message,
          notificationStatus : "unread",
          date : firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
  }

  getDonarDetails = (donarId) => {
    db.collection('Users').where("emailId", '==', donarId)
    .get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          donarName : doc.data().firstName + ' ' + doc.data().lastName
        })
      })
    })
  }

  

  componentDidMount(){
    this.getItemList();
    this.getDonarDetails(this.state.userId);
    //console.log("This is the list:" + this.state.requestedItemList)
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({item,i}) => {
    return (
      
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{'Requested By: ' + item.requestedBy + '\nStatus:' + item.requestStatus}
          </ListItem.Subtitle>
              {<View>
            <TouchableOpacity style = {[styles.button, 
              {backgroundColor : item.requestStatus === "Item Sent"? "green" : "#FF5722"}]}
            onPress = {()=>{
              this.sendItem(item);     
            }}
          >
            <Text style = {{color : '#FFFF'}}>Send Item</Text>
            </TouchableOpacity>
          </View>}
          
        </ListItem.Content>
      </ListItem>
      
    )
  }
    render(){
        return(
          <View style = {{flex : 1}}>
            <MyHeader
            title = 'My Donations'
            navigation = {this.props.navigation}
            />

            <View style = {{flex:1}}>
                {this.state.allDonations.length === 0
                ?(
                    <View style = {styles.Subtitle}>
                        <Text style = {{fontSize : 20}}>No donations have been made.</Text>
                    </View>
                )
                : (
                    <FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.allDonations}
                    renderItem = {this.renderItem}>
                     </FlatList>
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

