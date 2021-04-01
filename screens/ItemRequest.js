import React from 'react';
import {View, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Touchable, FlatList} from 'react-native';
import db from '../config';
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {ItemSearch} from 'react-native-google-books'

export default class ItemRequest extends React.Component{
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            itemName : '',
            reason : '',
            isItemRequestActive : false,
            userDocId : '',
            docId : '',
            requestedItemName : '',
            requestedItemStatus : '',
            requestId : '',
            dataSource : '',
            showFlatlist : false

        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }

    addRequest = async(itemName, reason) => {
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId();
        var item = await ItemSearch.searchitem(itemName, 'AIzaSyCLhVw_1amugkXzdsccCJbXahi7yb4vrgQ')
        db.collection('ItemRequests').add({
            userId : userId,
            itemName : itemName,
            reason : reason,
            requestId : randomRequestId,
            itemStatus : 'Requested',
            date : firebase.firestore.FieldValue.serverTimestamp(),
            imageLink : item.data[0].volumeInfo.imageLinks.smallThumbnail
        })
        await this.getItemRequest()
        console.log("after line 40", this.state.userId)
        db.collection('Users').where('emailId', '==', this.state.userId)
        .get().then((data)=>{
            data.forEach((doc)=>{
                console.log("line 43")
                db.collection('Users').doc(doc.id)
                .update({isItemRequestActive : true})
            })
        })
        this.setState({
            itemName : '',
            reason : '',
            requestId : randomRequestId
        })
        Alert.alert("Item requested successfully")
    }

    
    getItemRequest(){
        db.collection('ItemRequests').where('userId', '==', this.state.userId)
        .get()
        .then((data)=>{
            data.forEach((doc)=>{
                if(doc.data().itemStatus !== 'Recieved'){
                    this.setState({
                        requestId : doc.data().requestId,
                        requestedItemName : doc.data().itemName,
                        requestedItemStatus : doc.data().itemStatus,
                        docId : doc.id
                    })
                }
            })
        })
    }    
    
    getIsItemRequestActive(){
        db.collection('Users').where('emailId', '==', this.state.userId)
        .onSnapshot((snap)=>{
            snap.forEach((doc)=>{
                this.setState({
                    isItemRequestActive : doc.data().isItemRequestActive,
                    userDocId : doc.id
                })
            })
        })
    }

    updateItemStatus(){
        db.collection('ItemRequests').doc(this.state.docId).update({
            itemStatus : 'Recieved'
        })
        db.collection('Users').doc(this.state.userDocId)
        .update({ isItemRequestActive : false})
    }

    sendNotification(){
        db.collection('Users').where('emailId', '==', this.state.userId)
        .get().then((data)=>{
            data.forEach((doc)=>{
                var name = doc.data().firstName
                var lastName = doc.data().lastName
                db.collection('Notifications').where('requestId', '==', this.state.requestId)
                .get().then((snap)=>{
                    snap.forEach((doc)=>{
                        var donarId = doc.data().donarId
                        var itemName = doc.data().itemName
                        db.collection('Notifications').add({
                            targetedUserId : donarId,
                            message : name + ' ' + lastName + ' recieved the item ' + itemName,
                            notificationStatus : 'unread',
                            itemName : itemName
                        })
                    })
                })
            })
        })
    }

    getItemsFromAPI = async(itemName) => {
        this.setState({
            itemName : itemName
        })
        if(itemName.length > 2){
            var item = await ItemSearch.searchitem(itemName, 'AIzaSyCLhVw_1amugkXzdsccCJbXahi7yb4vrgQ')
            this.setState({
                dataSource : item.data,
                showFlatlist : true
            })
        }
    }

    renderItem = ({item,i}) => {
        return(
            <TouchableOpacity
            style = {{alignItems : 'center', backgroundColor : '#DDDDDD', padding : 10, width : "90%"}}
            onPress = {()=>{
                this.setState({
                    itemName : item.volumeInfo.title,
                    showFlatlist : false
                })
            }}
            bottomDivider
            >
                <Text>
                    {item.volumeInfo.title}
                </Text>

            </TouchableOpacity>
        )
    }

    componentDidMount = async() => {
        this.getItemRequest()
        this.getIsItemRequestActive()

    }
    render(){
        if(this.state.isItemRequestActive){
            return(
                <View style = {{flex : 1, justifyContent  :'center'}}>
                    <View style = {{justifyContent : 'center', alignItems : 'center', padding: 10, margin :10, borderWidth : 2, borderColor : 'orange'}}>
                        <Text>
                            Item Name : 
                        </Text>
                        <Text>
                            {this.state.requestedItemName}
                        </Text>
                    </View>

                    <View style = {{justifyContent : 'center', alignItems : 'center', padding: 10, margin :10, borderWidth : 2, borderColor : 'orange'}}>
                        <Text>
                            Item Status : 
                        </Text>
                        <Text>
                            {this.state.requestedItemStatus}
                        </Text>
                    </View>

                    <TouchableOpacity style = {{
                        alignItems : 'center',
                        alignSelf : 'center',
                        height: 30,
                        marginTop : 30,
                        width : 300,
                        backgroundColor : 'orange',
                        borderColor : 'orange',
                        borderWidth : 1
                    }}
                    onPress = {()=>{
                        this.updateItemStatus()
                        this.sendNotification()
                    }}>
                        <Text>
                            I have recieved the item.
                        </Text>
                    </TouchableOpacity>

                </View>
            )
        }
        else{
            return(
                <View style = {{flex : 1}}>
                    <MyHeader title = "Request Items"
                    navigation = {this.props.navigation}/>
                    <KeyboardAvoidingView style = {styles.keyBoardStyle}>
                        <TextInput style = {styles.formTextInput}
                        placeholder = "Enter item name"
                        onChangeText = {(text)=>{
                            this.getItemsFromAPI(text)
                            
                        }}
                        value = {this.state.itemName}/>
                    {this.state.showFlatlist?
                    (
                        <FlatList
                        data =  {this.state.dataSource}
                        renderItem = {this.renderItem}
                        style = {{ marginTop: 10 }}
                        keyExtractor = {(item,index)=>{
                            return index.toString()
                        }}
                        />
                    ): 
                    (
                        <View style = {{alignItems : 'center'}}>

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
                            this.addRequest(this.state.itemName, this.state.reason)
                        }}>
                            <Text>Request</Text>
    
                        </TouchableOpacity>

                        </View>
                        
                    )}
                    

                        
    
                        
    
    
    
                    </KeyboardAvoidingView>
    
                </View>
            )
        }    
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

