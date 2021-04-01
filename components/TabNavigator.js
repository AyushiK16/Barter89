import React from 'react';
import {Image} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import ItemDonate from '../screens/ItemDonate'
import ItemRequest from '../screens/ItemRequest'
import {StackNavigator} from './StackNavigator'

export const TabNavigator = createBottomTabNavigator({
    DonateItems : {
        screen : StackNavigator,
        navigationOptions : {
            tabBarIcon : <Image source = {require ('../assets/request-list.png')}
            style = {{width : 20, height : 20}}/>,

            tabBarLabel : "Item Donate"
        }
    },

    RequestItems : {
        screen : ItemRequest,
        navigationOptions : {
            tabBarIcon : <Image source = {require ('../assets/request-item.png')}
            style = {{width : 20, height : 20}}/>,
            
            tabBarLabel : "Item Request"
        }
    }
})

