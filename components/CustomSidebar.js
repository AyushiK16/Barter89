import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'
import {Avatar} from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import db from '../config'
import * as ImagePicker from 'expo-image-picker'

export default class CustomSidebar extends React.Component{
  constructor(){
    super();
    this.state = {
      userId : firebase.auth().currentUser.email,
      image : '#',
      name : ''
    }
  }

  getUserProfile(){
    db.collection('Users').where('emailId', '==', this.state.userId)
    .onSnapshot((snap)=>{
      snap.forEach((doc)=>{
        this.setState({
          name: doc.data().firstName + ' ' + doc.data().lastName
        })
      })
    })
  }

  selectPicture = async() => {
    var {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing : true,
      aspect : [3,4],
      quality : 1
    })

    if(!cancelled){
      this.setState({
        image : uri
      })
      this.uploadImage(uri, this.state.userId)
    }
  }

  uploadImage = async(uri,imageName) => {
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase.storage().ref().child('userProfiles/' + imageName)
    return(
      ref.put(blob).then(()=>{
        this.fetchImage(imageName);
      })
    )
  }

  fetchImage(imageName){
    var ref = firebase.storage().ref().child('userProfiles/' + imageName)
    ref.getDownloadURL().then((url)=>{
      this.setState({
        image : url
      })
    })
    .catch(()=>{
      this.setState({
        image : '#'
      })
    })
  }


  componentDidMount(){
    this.fetchImage(this.state.userId);
    this.getUserProfile()
  }
    render(){
      
        return(
            <View style = {{flex : 1}}>
              <View style = {{flex : 0.5, alignItems : 'center', backgroundColor : 'orange'}}>
                <Avatar
                  rounded
                  size = 'medium'
                  containerStyle = {styles.imageContainer}
                  showEditButton
                  source = {{uri : this.state.image}}
                  onPress = {()=>{
                    this.selectPicture()
                  }}

                />

                <Text style = {{fontSize : 20, fontWeight : '100', paddingTop : 10}}>
                  {this.state.name}

                </Text>
              </View>
                <View style = {StyleSheet.drawerItemsContainer}>
                    <DrawerItems
                    {...this.props}
                    />
                </View>
                <View style = {styles.logOutContainer}>
                    <TouchableOpacity style = {styles.logOutButton}
                    onPress = {()=>{
                        this.props.navigation.navigate('WelcomeScreen')
                        firebase.auth().signOut()
                    }}>
                        <Text> Logout </Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});