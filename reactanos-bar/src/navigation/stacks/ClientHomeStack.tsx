import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import ClientHomeScreen from '../../components/screens/ClientHomeScreen/ClientHomeScreen.component';
import QRStack from './QRStack';
import AddOrderScreen from '../../components/screens/AddOrderScreen/AddOrderScreen.component';
import FinishTableScreen from '../../components/screens/FinishTableScreen/FinishTableScreen.component';
import { useDispatch } from 'react-redux';
import { handleModal } from '../../redux/configurationReducer';
import AddPollScreen from '../../components/screens/AddPollScreen/AddPollScreen';
import ChatScreen from '../../components/screens/ChatScreen/ChatScreen.component';
import GuessTheNumberScreen from '../../components/screens/GuessTheNumberScreen/GuesstheNumberScreen';
import FinishTableStack from './FinishTableStack';
import GraphicScreen from '../../components/screens/GraphicScreen/GraphicScreen';

export type ClientHomeStackParamList = {
    [Screens.CLIENT_HOME]: undefined | {};
    [Screens.QR_SCANNER]: undefined | {}
    [Screens.ADD_ORDER]: undefined | {}
    [Screens.FINISH_TABLE]: undefined | {}
    [Screens.ADD_POLL]: undefined | {}
    [Screens.CHAT]: undefined | {}
    [Screens.GUESS_THE_NUMBER]: undefined | {}
    [Screens.GRAPHIC_SCREEN]: undefined | {}
};
const Stack = createStackNavigator<ClientHomeStackParamList>();

const ClientHomeStack = () => {
  const dispatch=useDispatch()
  return (
    <Stack.Navigator initialRouteName={Screens.CLIENT_HOME}  >
        <Stack.Screen name={Screens.CLIENT_HOME} component={ClientHomeScreen} options={({navigation}) => ({
          headerShown:true,
          headerRight:()=><TouchableOpacity style={{marginHorizontal:14}}
           onPress={() => dispatch(handleModal(true))}>
             <Feather name="settings" size={24} color="black" />
           </TouchableOpacity>
       ,
        headerLeft:()=><TouchableOpacity style={{marginHorizontal:14}}
          onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
      })} />
        <Stack.Screen name={Screens.QR_SCANNER} component={QRStack} options={{headerShown:false}} />
        <Stack.Screen name={Screens.ADD_ORDER} component={AddOrderScreen} />
        <Stack.Screen name={Screens.FINISH_TABLE} component={FinishTableStack} options={{headerShown:false}} />
        <Stack.Screen name={Screens.ADD_POLL} component={AddPollScreen} />
        <Stack.Screen name={Screens.CHAT} component={ChatScreen} />
        <Stack.Screen name={Screens.GUESS_THE_NUMBER} component={GuessTheNumberScreen}  />
        <Stack.Screen name={Screens.GRAPHIC_SCREEN} component={GraphicScreen}  />
    </Stack.Navigator>
  );
}

export default ClientHomeStack