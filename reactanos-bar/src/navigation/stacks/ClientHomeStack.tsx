import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import ClientHomeScreen from '../../components/screens/ClientHomeScreen/ClientHomeScreen.component';
import QRStack from './QRStack';
import AddOrderScreen from '../../components/screens/AddOrderScreen/AddOrderScreen.component';

export type ClientHomeStackParamList = {
    [Screens.CLIENT_HOME]: undefined | {};
    [Screens.QR_SCANNER]: undefined | {}
    [Screens.ADD_ORDER]: undefined | {}
};
const Stack = createStackNavigator<ClientHomeStackParamList>();

const ClientHomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={Screens.CLIENT_HOME}  >
        <Stack.Screen name={Screens.CLIENT_HOME} component={ClientHomeScreen} options={({navigation}) => ({
          headerShown:true,
        headerLeft:()=><TouchableOpacity style={{marginHorizontal:14}}
          onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
      })} />
        <Stack.Screen name={Screens.QR_SCANNER} component={QRStack} options={{headerShown:false}} />
        <Stack.Screen name={Screens.ADD_ORDER} component={AddOrderScreen} />
    </Stack.Navigator>
  );
}

export default ClientHomeStack