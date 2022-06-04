import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AddProductsScreen from '../components/screens/AddProductsScreen/AddProductsScreen.component';
import { Screens } from './Screens';
import { useDispatch } from 'react-redux';
import { handleLogout } from '../redux/authReducer';
import AddAdminsScreen from '../components/screens/AddAdminsController/AddAdminsScreen.component';
import AddClientScreen from '../components/screens/AddClient/AddClientScreen.component';

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
        <Drawer.Navigator initialRouteName={Screens.ADD_PRODUCTS} drawerContent={props => <CustomDrawerContent {...props} />} >
          <Drawer.Screen name={Screens.ADD_PRODUCTS} component={AddProductsScreen} />
          <Drawer.Screen name={Screens.ADD_ADMINS} component={AddAdminsScreen} />
          <Drawer.Screen name={Screens.ADD_CLIENT} component={AddClientScreen} />
        </Drawer.Navigator>
    );
}

export default DrawerStack