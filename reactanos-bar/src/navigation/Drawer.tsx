import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Screens } from './Screens';
import { useDispatch } from 'react-redux';
import { handleLogout } from '../redux/authReducer';
import AddAdminsScreen from '../components/screens/AddAdminsController/AddAdminsScreen.component';
import AddTableStack from './stacks/AddTableStack';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AddProductStack from './stacks/AddProductStack';
import AddClientScreen from '../components/screens/AddClient/AddClientScreen.component';
import AddEmployeeScreen from '../components/screens/AddEmployee/AddEmployeeScreen.component';
import ClientListScreen from '../components/screens/ClientListScreen/ClientListScreen.component';
import ChatScreen from '../components/screens/ChatScreen/ChatScreen.component';
import QRStack from './stacks/QRStack';
import ClientHomeScreen from '../components/screens/ClientHomeScreen/ClientHomeScreen.component';
import ClientHomeStack from './stacks/ClientHomeStack';
import WaitingClientListScreen from '../components/screens/WaitingClientListScreen/WaitingClientListScreen.component';
import WaitingClientListStack from './stacks/WaitingClientListStack';
import AddPollScreen from '../components/screens/AddPollScreen/AddPollScreen';
import GraphicScreen from '../components/screens/GraphicScreen/GraphicScreen';
import GuessTheNumberScreen from '../components/screens/GuessTheNumberScreen/GuesstheNumberScreen';
import AddOrderScreen from '../components/screens/AddOrderScreen/AddOrderScreen.component';
import WaitingOrderListScreen from '../components/screens/WaitingOrderListScreen/WaitingOrderListScreen.component';
import CompleteOrderStack from './stacks/CompleteOrderStack';
import SectorListScreen from '../components/screens/SectorListScreen/SectorListScreen.component';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props:any) {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar sesión"
        onPress={() => dispatch(handleLogout())}
      />
    </DrawerContentScrollView>
  );
}

const DrawerStack = () => {
    return (
        //  <Drawer.Navigator initialRouteName={Screens.ADD_PRODUCTS} drawerContent={props => <CustomDrawerContent {...props} />}>  
         <Drawer.Navigator initialRouteName={Screens.GUESS_THE_NUMBER} drawerContent={props => <CustomDrawerContent {...props} />}>  
         <Drawer.Screen name={Screens.GRAPHIC_SCREEN} component={GraphicScreen} />
          <Drawer.Screen name={Screens.ADD_PRODUCTS} component={AddProductStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.ADD_ADMINS} component={AddAdminsScreen} />
          <Drawer.Screen name={Screens.ADD_TABLE} component={AddTableStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.ADD_CLIENT} component={AddClientScreen} />
          <Drawer.Screen name={Screens.ADD_EMPLOYEE} component={AddEmployeeScreen} />
          <Drawer.Screen name={Screens.CLIENT_LIST} component={ClientListScreen} />
          <Drawer.Screen name={Screens.CHAT} component={ChatScreen} />
          <Drawer.Screen name={Screens.CLIENT_HOME} component={ClientHomeStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.WAITING_CLIENT_LIST} component={WaitingClientListStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.ADD_POLL} component={AddPollScreen} />
          <Drawer.Screen name={Screens.GUESS_THE_NUMBER} component={GuessTheNumberScreen} />
          <Drawer.Screen name={Screens.ADD_ORDER} component={AddOrderScreen} />
          <Drawer.Screen name={Screens.ORDER_LIST} component={WaitingOrderListScreen} />
          <Drawer.Screen name={Screens.PENDING_ORDER_LIST} component={CompleteOrderStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.SECTOR_LIST} component={SectorListScreen} />
        </Drawer.Navigator>
    );
} 

export default DrawerStack