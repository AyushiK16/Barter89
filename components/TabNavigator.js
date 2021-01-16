import React from 'react';
import {Image} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import BookDonate from '../screens/BookDonate'
import BookRequest from '../screens/BookRequest'

export const TabNavigator = createBottomTabNavigator({
    DonateBooks : {
        screen : BookDonate,
        navigationOptions : {
            tabBarIcon : <Image source = {require ('../assets/request-list.png')}
            style = {{width : 20, height : 20}}/>,

            tabBarLabel : "Book Donate"
        }
    },

    RequestBooks : {
        screen : BookRequest,
        navigationOptions : {
            tabBarIcon : <Image source = {require ('../assets/request-book.png')}
            style = {{width : 20, height : 20}}/>,
            
            tabBarLabel : "Book Request"
        }
    }
})

