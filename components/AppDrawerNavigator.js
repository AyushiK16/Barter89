import {createDrawerNavigator} from 'react-navigation-drawer';
import CustomSidebar from './CustomSidebar'
import { TabNavigator } from './TabNavigator';
import Settings from '../screens/Settings'
import MyDonation from '../screens/MyDonation'
import Notifications from '../screens/Notifications'

export const AppDrawerNavigator = createDrawerNavigator({
    Home : {screen : TabNavigator},
    Settings : {screen : Settings},
    MyDonation : {screen : MyDonation},
    Notifications : {screen : Notifications}
},
{ contentComponent : CustomSidebar},
{ initialRouteName : "Home" }
)