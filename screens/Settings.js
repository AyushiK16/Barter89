import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Touchable} from 'react-native';
import db from '../config';
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';
import  MyHeader  from '../components/MyHeader';

export default class Settings extends React.Component{
    constructor(){
        super();
        this.state = {
            emailId: '',
            firstName:  '',
            address: '',
            contact: '',
            lastName: '',
            docId : ''
        }
    }

    getUserDetails = () => {
        var email = firebase.auth().currentUser.email
        db.collection('Users')
        .where('emailId', '==', email)
        .get()
        .then((data)=>{
            data.forEach((doc)=>{
                var info = doc.data()
                this.setState({
                    firstName : info.firstName,
                    lastName : info.lastName,
                    address : info.address,
                    contact : info.contact,
                    docId : doc.id
                })
            })
        })
    }

    updateUserDetails = () => {
        db.collection('Users').doc(this.state.docId).update({
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            contact : this.state.contact,
            address : this.state.address
        })
    }

    componentDidMount(){
        this.getUserDetails();
    }



render(){
    return(
        <View style = {styles.container}>
            <MyHeader
            title = 'Settings'
            navigation = {this.props.navigation}
            />
            <View style = {styles.formContainer}>
                <TextInput style = {styles.formTextInput}
                placeholder = 'First Name'
                maxLength = {8}
                onChangeText = {(text)=>{
                    this.setState({
                        firstName : text
                    })
                }}
                value = {this.state.firstName}
                
                />

                <TextInput style = {styles.formTextInput}
                placeholder = 'Last Name'
                maxLength = {8}
                onChangeText = {(text)=>{
                    this.setState({
                        lastName : text
                    })
                }}
                value = {this.state.lastName}
                />

                <TextInput style = {styles.formTextInput}
                placeholder = 'Contact'
                maxLength = {10}
                keyboardType = 'numeric'
                onChangeText = {(text)=>{
                    this.setState({
                        contact : text
                    })
                }}
                value = {this.state.contact}
                />

                <TextInput style = {styles.formTextInput}
                placeholder = 'Address'
                multiline = {true}
                onChangeText = {(text)=>{
                    this.setState({
                        address : text
                    })
                }}
                value = {this.state.address}
                />

                <TouchableOpacity style = {styles.button}
                onPress = {()=>{
                    this.updateUserDetails();
                }}
                >
                    <Text style = {styles.buttonText}> Update </Text>
                </TouchableOpacity>

            </View>
            

        </View>

    )
}
}

const styles = StyleSheet.create({
    container : {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContainer:{
      flex:1,
      width:'100%',
      alignItems: 'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
    },
    buttonText:{
      fontSize:25,
      fontWeight:"bold",
      color:"#fff"
    }
  })