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
import QRStack from './stacks/QRStack';
import ClientHomeScreen from '../components/screens/ClientHomeScreen/ClientHomeScreen.component';
import ClientHomeStack from './stacks/ClientHomeStack';
import WaitingClientListScreen from '../components/screens/WaitingClientListScreen/WaitingClientListScreen.component';
import WaitingClientListStack from './stacks/WaitingClientListStack';
import AddPollScreen from '../components/screens/AddPollScreen/AddPollScreen';

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
        <Drawer.Navigator initialRouteName={Screens.ADD_PRODUCTS} drawerContent={props => <CustomDrawerContent {...props} />}> 
          <Drawer.Screen name={Screens.ADD_PRODUCTS} component={AddProductStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.ADD_ADMINS} component={AddAdminsScreen} />
          <Drawer.Screen name={Screens.ADD_TABLE} component={AddTableStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.ADD_CLIENT} component={AddClientScreen} />
          <Drawer.Screen name={Screens.ADD_EMPLOYEE} component={AddEmployeeScreen} />
          <Drawer.Screen name={Screens.CLIENT_LIST} component={ClientListScreen} />
          <Drawer.Screen name={Screens.CLIENT_HOME} component={ClientHomeStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.WAITING_CLIENT_LIST} component={WaitingClientListStack} options={{headerShown:false}} />
          <Drawer.Screen name={Screens.ADD_POLL} component={AddPollScreen} />
        </Drawer.Navigator>
    );
}

export default DrawerStack