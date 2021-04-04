import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Image} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {Card, Header, Icon} from 'react-native-elements'
import {RFValue} from 'react-native-responsive-fontsize'

export default class DetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userId : firebase.auth().currentUser.email,
            recieverId : this.props.navigation.getParam('details')['userId'],
            requestId : this.props.navigation.getParam('details')['requestId'],
            itemName: this.props.navigation.getParam('details')['itemName'],
            reason: this.props.navigation.getParam('details')['reason'],
            recieverName : '',
            recieverContact: '',
            recieverAddress: '',
            recieverDocId : '',
            userName : '',
        }

        //console.log('This is the details screen',this.state.itemName)
    }

    getRecieverDetails(){
        db.collection('Users').where('emailId', '==', this.state.recieverId)
        .get()
        .then((info)=>{
            info.forEach((doc)=>{
                this.setState({
                    recieverName : doc.data().firstName,
                    recieverContact : doc.data().contact,
                    recieverAddress : doc.data().address
                })
            })
        })
        
    }

    updateItemStatus(){
        db.collection('AllDonations').add({
            itemName : this.state.itemName,
            requestId : this.state.requestId,
            requestedBy : this.state.recieverName,
            donarId : this.state.userId,
            requestStatus : 'Donar Interested'})
    }

    componentDidMount(){
        this.getRecieverDetails();
        this.getUserDetails(this.state.userId)
    }

    addNotification(){
        var message = this.state.userName + ' has shown interest in donating the item.'
        db.collection('Notifications').add({
            targetedUserId : this.state.recieverId,
            donarId : this.state.userId,
            requestId : this.state.requestId,
            itemName : this.state.itemName,
            message : message,
            notificationStatus : 'unread',
            date : firebase.firestore.FieldValue.serverTimestamp()
        })

    }

    getUserDetails(userId){
      db.collection('Users').where("emailId", "==", userId)
      .get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            userName : doc.data().firstName + ' ' + doc.data().lastName
          })
        })
      })
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.1 }}>
            <Header
              leftComponent={
                <Icon
                  name="arrow-left"
                  type="feather"
                  color="#ffffff"
                  onPress={() => this.props.navigation.goBack()}
                />
              }
              centerComponent={{
                text: "Donate Items",
                style: {
                  color: "#ffffff",
                  fontSize: RFValue(20),
                  fontWeight: "bold",
                },
              }}
              backgroundColor="#32867d"
            />
          </View>
          <View style={{ flex: 0.9 }}>
            <View
              style={{
                flex: 0.3,
                flexDirection: "row",
                paddingTop: RFValue(30),
                paddingLeft: RFValue(10),
              }}
            >
              
              </View>
              <View
                style={{
                  flex: 0.6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: RFValue(25),
                    textAlign: "center",
                  }}
                >
                  {this.state.itemName}
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: RFValue(15),
                    textAlign: "center",
                    marginTop: RFValue(15),
                  }}
                >
                  {this.state.reason}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 0.7,
                padding: RFValue(20),
              }}
            >
              <View style={{ flex: 0.7 ,justifyContent:'center',alignItems:'center',marginTop:RFValue(50),borderWidth:1,borderColor:'#deeedd',padding:RFValue(10)}}>
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: RFValue(30),
                  }}
                >
                  Reciever Information
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: RFValue(20),
                    marginTop: RFValue(30),
                  }}
                >
                  Name : {this.state.recieverName}
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: RFValue(20),
                    marginTop: RFValue(30),
                  }}
                >
                  Contact: {this.state.recieverContact}
                </Text>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: RFValue(20),
                    marginTop: RFValue(30),
                  }}
                >
                  Address: {this.state.recieverAddress}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.state.recieverId !== this.state.userId ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.updateItemStatus();
                      this.addNotification();
                      this.props.navigation.navigate("MyDonations");
                    }}
                  >
                    <Text>I want to Donate</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      width: "75%",
      height: RFValue(60),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: RFValue(60),
      backgroundColor: "#ff5722",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 16,
    },
  });