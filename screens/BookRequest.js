import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Touchable} from 'react-native';
import db from '../config';
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';
import {MyHeader} from '../components/MyHeader'

export default class BookRequest extends React.Component{
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            bookName : '',
            reason : ''
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }
    addRequest = (bookName, reason) => {
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId();
        db.collection('BookRequests').add({
            userId : userId,
            bookName : bookName,
            reason : reason,
            requestId : randomRequestId
        })
        this.setState({
            bookName : '',
            reason : ''
        })
        Alert.alert("Book requested successfully")
    }
    render(){
        return(
            <View style = {{flex : 1}}>
                <MyHeader title = "Request Books"/>
                <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                    <TextInput style = {styles.formTextInput}
                    placeholder = "Enter book name"
                    onChangeText = {(text)=>{
                        this.setState({
                            bookName : text
                        })
                        
                    }}
                    value = {this.state.bookName}/>
                    

                    <TextInput style = {styles.formTextInput}
                    placeholder = "Reason"
                    multiline 
                    numberOfLines = {8}
                    onChangeText = {(text)=>{
                        this.setState({
                            reason : text
                        })
                        
                    }}
                    value = {this.state.reason}/>

                    <TouchableOpacity style = {styles.button}
                    onPress = {()=>{
                        this.addRequest(this.state.bookName, this.state.reason)
                    }}>
                        <Text>Request</Text>

                    </TouchableOpacity>



                </KeyboardAvoidingView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
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
    }
  )