import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import QRCodeScreen from '../../components/screens/QRCodeScreen/QRCodeScreen.component';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import AddProductsScreen from '../../components/screens/AddProductsScreen/AddProductsScreen.component';
import { useDispatch} from 'react-redux';
import { handleModal } from '../../redux/configurationReducer';
import QRScannerScreen from '../../components/screens/QRScannerScreen/QRScannerScreen.component';
import FinishTableScreen from '../../components/screens/FinishTableScreen/FinishTableScreen.component';

export type AddProductStackParamList = {
    [Screens.FINISH_TABLE]: undefined | {};
    [Screens.QR_SCANNER]: undefined | {title:string, subtitle:string, code:string};
};
const Stack = createStackNavigator<AddProductStackParamList>();

const FinishTableStack = () => {
  const dispatch = useDispatch();
  return (
    <Stack.Navigator initialRouteName={Screens.FINISH_TABLE} >
        <Stack.Screen name={Screens.FINISH_TABLE} component={FinishTableScreen} options={({navigation}) => ({
          headerRight:()=><TouchableOpacity style={{marginHorizontal:14}}
           onPress={() => dispatch(handleModal(true))}>
             <Feather name="settings" size={24} color="black" />
           </TouchableOpacity>
       ,
      })} />
        <Stack.Screen name={Screens.QR_SCANNER} component={QRScannerScreen} />
    </Stack.Navigator>
  );
}

export default FinishTableStack