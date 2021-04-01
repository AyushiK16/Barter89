import {createStackNavigator} from 'react-navigation-stack'
import ItemDonate from '../screens/ItemDonate';
import DetailsScreen from '../screens/DetailsScreen';

export const StackNavigator = createStackNavigator({
    ItemDonateList : {screen : ItemDonate,
        navigationOptions : {headerShown : false}},
    
    RecieverDetails : {screen : DetailsScreen,
        navigationOptions : {headerShown : false}}
},

{intialRouteName : 'ItemDonateList'}

)


