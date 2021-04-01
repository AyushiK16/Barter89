import React from 'react';
import {View, Image, TouchableOpacity, Text, TextInput, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, FlatList} from 'react-native';
import db from '../config';
import {ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader'
//import SantaAnimation from '../components/Santa.js';
import firebase from 'firebase';

export default class BookDonate extends React.Component{
  constructor(){
    super();
    this.state = {
      requestedBookList : []
    }
  }

  getBookList = () => {
    db.collection('ItemRequests').onSnapshot((data)=>{
      var bookList = data.docs.map(doc => doc.data())
      //console.log("HERE " + bookList)
      this.setState({
        requestedBookList : bookList
      })
      console.log("function:" + this.state.requestedBookList)

      //whenever want to put it in a flatlist, use map()
    })
  }

  componentDidMount(){
    this.getBookList();
    console.log("This is the list:" + this.state.requestedBookList)
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({item,i}) => {
    return (
      
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <Image
          style = {{height : 50, width : 50}}
          source = {{uri : item.imageLink}}
          />
          <ListItem.Title>{item.bookName}</ListItem.Title>
          <ListItem.Subtitle>{item.reason}</ListItem.Subtitle>
          <View>
            <TouchableOpacity style = {styles.button}
            onPress = {()=>{
              this.props.navigation.navigate('RecieverDetails', {'details' : item})
            }}
          >
            <Text>View</Text>
            </TouchableOpacity>
          </View>
        </ListItem.Content>
      </ListItem>
    )
  }
    render(){
        return(
          <View style = {{flex : 1}}>
            <MyHeader
            title = 'Donate Books'
            navigation = {this.props.navigation}
            />
            <FlatList
            keyExtractor = {this.keyExtractor}
            data = {this.state.requestedBookList}
            renderItem = {this.renderItem}>

            </FlatList>

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