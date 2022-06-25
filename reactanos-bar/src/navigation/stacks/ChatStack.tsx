import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import ListChatEmployeeScreen from '../../components/screens/ListChatEmployeeScreen/ListChatEmployeeScreen.component';
import ChatScreen from '../../components/screens/ChatScreen/ChatScreen.component';
import { useDispatch } from 'react-redux';
import { handleModal } from '../../redux/configurationReducer';

export type ClientHomeStackParamList = {
    [Screens.LIST_CHAT]: undefined | {};
    [Screens.CHAT]: undefined | {}  
};
const Stack = createStackNavigator<ClientHomeStackParamList>();

const ChatStack = () => {

  const dispatch = useDispatch();
  return (
    <Stack.Navigator initialRouteName={Screens.LIST_CHAT}  >
        <Stack.Screen name={Screens.LIST_CHAT} component={ListChatEmployeeScreen} options={({navigation}) => ({
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
        <Stack.Screen name={Screens.CHAT} component={ChatScreen} />

    </Stack.Navigator>
  );
}

export default ChatStack