import React from 'react';
import {Header, Icon, Badge} from 'react-native-elements'
import {View} from 'react-native'
import firebase from 'firebase'
import db from '../config'

export default class MyHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            userId : firebase.auth().currentUser.email,
            value : ''
        })

    }

    getNotifications(){
        db.collection('Notifications').where('notificationStatus', '==', 'unread')
        .where('targetedUserId', '==', this.state.userId)
        .onSnapshot((snapshot)=>{
            var unread = snapshot.docs.map((doc)=>{
                console.log("BADGE: ", doc.data())
                return doc.data()
            })
            this.setState({
                value : unread.length
            })
            //console.log("BADGE", this.state.value)
        })
    }

    componentDidMount(){
        this.getNotifications();
    }

    BellIcon = () => {
        return(
            <View>
                <Icon
                    type = 'font-awesome'
                    name = 'bell'
                    color = '#696969'
                    size = {25}
                    onPress = {()=>{
                        this.props.navigation.navigate('Notifications')
                    }}
                />
    
                <Badge
                    value = {this.state.value}
                    containerStyle = {{position: 'absolute', top: -4, right: -4}}
                
                />
    
            </View>
        )
    }
    render(){
        return(
            <Header centerComponent = {{text:this.props.title,
                style : {color : '#90A5A9', fontSize : 20, fontWeight : 'bold'}}}
                backgroundColor = '#EAF8FE'
                leftComponent =  {<Icon
                    type = 'font-awesome'
                    name = 'bars'
                    color = '#696969'
                    onPress = {()=>{
                        this.props.navigation.toggleDrawer()
                    }}
                
                    />}
                    rightComponent = {<this.BellIcon {...this.props}/>}
                ></Header>
        )
    }
}

