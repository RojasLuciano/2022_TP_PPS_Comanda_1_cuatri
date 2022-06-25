import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import QRButtonScreen from '../../components/screens/QRButtonScreen/QRButtonScreen.component';
import QRScannerScreen from '../../components/screens/QRScannerScreen/QRScannerScreen.component';

export type AddProductStackParamList = {
    [Screens.QR_BUTTON]: undefined | {};
    [Screens.QR_SCANNER]: undefined | {}
};
const Stack = createStackNavigator<AddProductStackParamList>();

const QRStack = () => {
  return (
    <Stack.Navigator initialRouteName={Screens.QR_BUTTON} screenOptions={{headerShown:false}}  >
        <Stack.Screen name={Screens.QR_BUTTON} component={QRButtonScreen} options={({navigation}) => ({
          headerShown:true,
      })} />
        <Stack.Screen name={Screens.QR_SCANNER} component={QRScannerScreen} options={{headerShown:true, headerTitle:"Escanear QR"}} />
    </Stack.Navigator>
  );
}

export default QRStack