import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Touchable} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {Card, Header, Icon} from 'react-native-elements'

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

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex:0.1}}>
                    <Header leftComponent = {<Icon
                    name = 'arrow-left'
                    type = 'feather'
                    color = '#696969'
                    onPress = {()=>{
                        this.props.navigation.goBack()
                    }}
                    />}

                    centerComponent = {{
                        text : 'DonateItems', 
                        style : {color: '#90A5A9', 
                                fontSize : 20, 
                                fontWeight : 'bold'}
                        }}

                    backgroundColor = "#EAF8FE"
                    
                    >

                    </Header>

                </View>
                <View style={{flex:0.3}}>
          <Card
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Receiver Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateItemStatus();
                    this.addNotification();
                    this.props.navigation.navigate('MyDonations')
                  }}>
                <Text>I want to Donate</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 10,
      backgroundColor: 'orange',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    }
  })


