import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Touchable} from 'react-native';
import db from '../config';
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';
import Santa from '../components/Santa'

export default class WelcomeScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            emailId :'',
            password:'',
            isModalVisible: false,
            firstName: '',
            lastName : '',
            address : '',
            contact : '',
            confirmPassword : ''
        }
    }
    userSignup = (emailId, password, confirmPassword) =>{
        if(password !== confirmPassword){
            alert("Passwords don't match.")
        }

        else{
            firebase.auth().createUserWithEmailAndPassword(emailId,password)
        .then((response)=>{
            db.collection('Users').add({
                firstName : this.state.firstName,
                lastName : this.state.lastName,
                contact : this.state.contact,
                address : this.state.address,
                emailId : this.state.emailId.toLowerCase(),
                isItemRequestActive : false
            })
            return Alert.alert(
                "User Added", 
                "The User ID was created successfully.",
                [
                {
                    text : 'OK',
                    onPress : ()=>{
                        this.setState({
                            isModalVisible : false
                        })
                    }
                }
            ]);
        })
        .catch(function(error){
            var errorCode = error.code;
            var errorMsg = error.message;
            return Alert.alert(errorMsg);
        })
        }
        

    }

    userLogin = (emailId, password) =>{
        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then(()=>{
            this.props.navigation.navigate('DonateItems');
        }
        )
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(errorMessage);
            // ...
          });
    }

    showModal = () => {
        return (
            <Modal
            animationType = 'fade'
            transparent = {true}
            visible = {this.state.isModalVisible}>
                <View style = {styles.modalContainer}>
                    <ScrollView style = {{width : '100%'}}>
                        <KeyboardAvoidingView style = {styles.KeyboardAvoidingView}>
                            <Text style = {styles.modalTitle}> Registration </Text>
                            <TextInput style = {styles.formTextInput}
                            placeholder = 'First Name'
                            maxLength = {8}
                            onChangeText = {(text)=>{
                                this.setState({
                                    firstName : text
                                })
                            }}/> 

                            <TextInput style = {styles.formTextInput}
                            placeholder = 'Last Name'
                            maxLength = {10}
                            onChangeText = {(text)=>{
                                this.setState({
                                    lastName : text
                                })
                            }}/> 



                            <TextInput style = {styles.formTextInput}
                            placeholder = 'Contact'
                            maxLength = {8}
                            keyboardType = {'numeric'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    contact : text
                                })
                            }}/> 

                            <TextInput style = {styles.formTextInput}
                            placeholder = 'Address'
                            multiline = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    address : text
                                })
                            }}/> 

                            <TextInput style = {styles.formTextInput}
                            placeholder = 'Email'
                            keyboardType = {'email-address'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    emailId : text
                                })
                            }}/> 

                            <TextInput style = {styles.formTextInput}
                            placeholder = 'Password'
                            secureTextEntry = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    password : text
                                })
                            }}/> 

                            <TextInput style = {styles.formTextInput}
                            placeholder = 'Confirm Password'
                            secureTextEntry = {true}
                            onChangeText = {(text)=>{
                                this.setState({
                                    confirmPassword : text
                                })
                            }}/> 

                            <View>
                                <TouchableOpacity style = {styles.registerButton}
                                onPress = {()=>{
                                    this.userSignup(this.state.emailId, this.state.password, this.state.confirmPassword)     
                                }}>
                                    <Text>Register</Text>
                                </TouchableOpacity>
                                
                            </View>

                            <View>
                                <TouchableOpacity style = {styles.cancelButton}
                                onPress = {()=>{
                                    this.setState({
                                        isModalVisible : false
                                    })
                                }}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                
                            </View>

                        </KeyboardAvoidingView>

                    </ScrollView>

                </View>
            </Modal>
        )
    }

    render(){
        return(
            <View style = {styles.container}>
                <View style = {styles.profileContainer}>
                   <Santa/>
                   <Text style = {styles.title}>Barter System!</Text> 
                </View>
                <View style = {{justifyContent : 'center', alignItems : 'center'}}>
                    {this.showModal()}
                </View>
            <View style={styles.buttonContainer}>
                <TextInput
                style = {styles.loginBox}
                placeholder = "abc@gmail.com"
                keyboardType = "email-address"
                onChangeText = {(text)=>{
                    this.setState({
                        emailId : text
                    })
                }}
                />
                <TextInput
                style = {styles.loginBox}
                placeholder = "Password"
                secureTextEntry = {true}
                onChangeText = {(text)=>{
                    this.setState({
                        password : text
                    })
                }}
                />
                <TouchableOpacity
                style = {[styles.button,{marginBottom:20, marginTop:20}]}
                onPress = {()=>{
                    this.userLogin(this.state.emailId, this.state.password)
                }}
                >
                <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style = {styles.button}
                onPress = {()=>{
                    this.setState({
                        isModalVisible : true
                    })
                }}
                >
                <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
     flex:1,
     backgroundColor:'#F8BE85',
     alignItems: 'center',
     justifyContent: 'center'
   },
   profileContainer:{
     flex:1,
     justifyContent:'center',
     alignItems:'center',
   },
   title :{
     fontSize:65,
     fontWeight:'300',
     paddingBottom:30,
     color : '#ff3d00'
   },
   loginBox:{
     width: 300,
     height: 40,
     borderBottomWidth: 1.5,
     borderColor : '#ff8a65',
     fontSize: 20,
     margin:10,
     paddingLeft:10
   },
   KeyboardAvoidingView:{
     flex:1,
     justifyContent:'center',
     alignItems:'center'
   },
   modalTitle :{
     justifyContent:'center',
     alignSelf:'center',
     fontSize:30,
     color:'#ff5722',
     margin:50
   },
   modalContainer:{
     flex:1,
     borderRadius:20,
     justifyContent:'center',
     alignItems:'center',
     backgroundColor:"#ffff",
     marginRight:30,
     marginLeft : 30,
     marginTop:80,
     marginBottom:80,
   },
   formTextInput:{
     width:"75%",
     height:35,
     alignSelf:'center',
     borderColor:'#ffab91',
     borderRadius:10,
     borderWidth:1,
     marginTop:20,
     padding:10
   },
   registerButton:{
     width:200,
     height:40,
     alignItems:'center',
     justifyContent:'center',
     borderColor:'#ffab91',
     borderWidth:1,
     borderRadius:10,
     marginTop:30
   },
   registerButtonText:{
     color:'#ff5722',
     fontSize:15,
     fontWeight:'bold'
   },
   cancelButton:{
     width:200,
     height:30,
     justifyContent:'center',
     alignItems:'center',
     marginTop:5,
   },
  
   button:{
     width:300,
     height:50,
     justifyContent:'center',
     alignItems:'center',
     borderRadius:25,
     backgroundColor:"#ff9800",
     shadowColor: "#000",
     shadowOffset: {
        width: 0,
        height: 8,
     },
     shadowOpacity: 0.30,
     shadowRadius: 10.32,
     elevation: 16,
     padding: 10
   },
   buttonText:{
     color:'#ffff',
     fontWeight:'200',
     fontSize:20
   }
  })