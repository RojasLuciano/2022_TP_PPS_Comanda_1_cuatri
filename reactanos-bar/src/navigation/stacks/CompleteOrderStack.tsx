import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import QRStack from './QRStack';
import CompleteOrderFirstScreen from '../../components/screens/CompleteOrderFirstScreen/CompleteOrderFirstScreen.component';
import CompleteOrderSecondScreen from '../../components/screens/CompleteOrderSecondScreen/CompleteOrderSecondScreen.component';
import { useDispatch } from 'react-redux';
import { handleModal } from '../../redux/configurationReducer';

export type ClientHomeStackParamList = {
    [Screens.PENDING_ORDER_LIST]: undefined | {};
    [Screens.PENDING_ORDER]: undefined | {};
};
const Stack = createStackNavigator<ClientHomeStackParamList>();

//Esta pantalla es Tomar comanda

const CompleteOrderStack = () => {
  const dispatch=useDispatch();
  return (
    <Stack.Navigator initialRouteName={Screens.PENDING_ORDER_LIST}  >
        <Stack.Screen name={Screens.PENDING_ORDER_LIST} component={CompleteOrderFirstScreen} options={({navigation}) => ({
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
        <Stack.Screen name={Screens.PENDING_ORDER} component={CompleteOrderSecondScreen}  />
    </Stack.Navigator>
  );
}

export default CompleteOrderStack