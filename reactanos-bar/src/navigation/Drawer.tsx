import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Screens } from './Screens';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '../redux/authReducer';
import AddAdminsScreen from '../components/screens/AddAdminsController/AddAdminsScreen.component';
import AddTableStack from './stacks/AddTableStack';
import AddProductStack from './stacks/AddProductStack';
import AddClientScreen from '../components/screens/AddClient/AddClientScreen.component';
import AddEmployeeScreen from '../components/screens/AddEmployee/AddEmployeeScreen.component';
import ClientListScreen from '../components/screens/ClientListScreen/ClientListScreen.component';
import ChatScreen from '../components/screens/ChatScreen/ChatScreen.component';
import ClientHomeStack from './stacks/ClientHomeStack';
import WaitingClientListStack from './stacks/WaitingClientListStack';
import AddPollScreen from '../components/screens/AddPollScreen/AddPollScreen';
import GraphicScreen from '../components/screens/GraphicScreen/GraphicScreen';
import GuessTheNumberScreen from '../components/screens/GuessTheNumberScreen/GuesstheNumberScreen';
import WaitingOrderListScreen from '../components/screens/WaitingOrderListScreen/WaitingOrderListScreen.component';
import CompleteOrderStack from './stacks/CompleteOrderStack';
import CollectMoneyScreen from '../components/screens/CollectTableMoneyScreen/CollectTableMoneyScreen.component';
import ChatStack from './stacks/ChatStack';
import DeliverOrderTableListScreen from '../components/screens/DeliverOrderTableListScreen/DeliverOrderTableListScreen.component';
import { notificationsConfiguration } from '../utils/pushNotifications';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from '../components/atoms/Modal/Modal.component';
import { handleModal } from '../redux/configurationReducer';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props} >
      <DrawerItemList {...props}   />
      <DrawerItem
        label="Cerrar sesión"
        onPress={() => dispatch(handleLogout())}
      />
    </DrawerContentScrollView>
  );
}

const DrawerStack = () => {
  const userData: any = useSelector<any>((store) => store.auth);
  const configuration: any = useSelector<any>((store) => store.configuration);
  const dispatch = useDispatch();
  useEffect(() => {
    notificationsConfiguration(userData.user);
  }, [])
  if (userData.user.profile === "invitado" || userData.user.profile === "cliente") {
    return (
      <>
      <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
        <Drawer.Navigator initialRouteName={Screens.CLIENT_HOME} drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name={Screens.CLIENT_HOME} component={ClientHomeStack} options={{ headerShown: false }} />
        </Drawer.Navigator>
      </>
    );
  }
  if (userData.user.profile === "admin") {
    return (
      <>
      <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
      <Drawer.Navigator initialRouteName={Screens.CLIENT_LIST} screenOptions={({navigation}:any) => ({
        headerRight:()=><TouchableOpacity style={{marginHorizontal:14}}
          onPress={() => dispatch(handleModal(true))}>
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
      })} drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name={Screens.ADD_TABLE} component={AddTableStack} options={{ headerShown: false }} />
        <Drawer.Screen name={Screens.ADD_POLL} component={AddPollScreen} />
        <Drawer.Screen name={Screens.ADD_ADMINS} component={AddAdminsScreen} />
        <Drawer.Screen name={Screens.ADD_PRODUCTS} component={AddProductStack} options={{ headerShown: false }} />
        <Drawer.Screen name={Screens.ADD_EMPLOYEE} component={AddEmployeeScreen} />
        <Drawer.Screen name={Screens.GRAPHIC_SCREEN} component={GraphicScreen} />
        <Drawer.Screen name={Screens.CLIENT_LIST} component={ClientListScreen} />
      </Drawer.Navigator>
      </>
    );
  }
  if (userData.user.profile === "supervisor") {
    return (
      <>
        <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
        <Drawer.Navigator initialRouteName={Screens.WAITING_CLIENT_LIST} drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name={Screens.ADD_EMPLOYEE} component={AddEmployeeScreen} />
          <Drawer.Screen name={Screens.ADD_POLL} component={AddPollScreen} />
          <Drawer.Screen name={Screens.ADD_PRODUCTS} component={AddProductStack} options={{ headerShown: false }} />
          <Drawer.Screen name={Screens.GRAPHIC_SCREEN} component={GraphicScreen} />
          <Drawer.Screen name={Screens.WAITING_CLIENT_LIST} component={WaitingClientListStack} options={{ headerShown: false }} />
          <Drawer.Screen name={Screens.CLIENT_LIST} component={ClientListScreen} />
        </Drawer.Navigator>
      </>
    );
  }
  if (userData.user.profile === "cook" || userData.user.profile === "bartender") {
    return (
      <>
        <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
        <Drawer.Navigator initialRouteName={Screens.PENDING_ORDER_LIST} drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name={Screens.PENDING_ORDER_LIST} component={CompleteOrderStack} options={{ headerShown: false }} />
          <Drawer.Screen name={Screens.ADD_PRODUCTS} component={AddProductStack} options={{ headerShown: false }} />
        </Drawer.Navigator>
      </>
    );
  }
  if (userData.user.profile === "deliveryman") {
    return (
      <Drawer.Navigator initialRouteName={Screens.GUESS_THE_NUMBER} drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name={Screens.GUESS_THE_NUMBER} component={GuessTheNumberScreen} />
      </Drawer.Navigator>
    );
  }
  if (userData.user.profile === "waiter") { //mozo
    return (
      <>
        <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
        <Drawer.Navigator initialRouteName={Screens.ORDER_LIST} drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name={Screens.ADD_CLIENT} component={AddClientScreen} />
          <Drawer.Screen name={Screens.LIST_CHAT} component={ChatStack} options={{ headerShown: false }} />
          <Drawer.Screen name={Screens.ORDER_LIST} component={WaitingOrderListScreen} />
          <Drawer.Screen name={Screens.PENDING_ORDER_LIST} component={CompleteOrderStack} options={{ headerShown: false }} />
          <Drawer.Screen name={Screens.DELIVER_ORDER_TABLE} component={DeliverOrderTableListScreen} />
          <Drawer.Screen name={Screens.COLLECT_TABLE_MONEY} component={CollectMoneyScreen} />
        </Drawer.Navigator>
      </>
    );
  }
  if (userData.user.profile === "meter") {
    return (
      <>
        <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
        <Drawer.Navigator initialRouteName={Screens.WAITING_CLIENT_LIST} drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name={Screens.ADD_CLIENT} component={AddClientScreen} />
          <Drawer.Screen name={Screens.WAITING_CLIENT_LIST} component={WaitingClientListStack} options={{ headerShown: false }} />
        </Drawer.Navigator>
      </>
    );
  }
  return (
    <>
      <Modal isVisible={configuration.modal} onPrimaryText='Aceptar' title='Configuración' onPrimary={()=>dispatch(handleModal(false))} sound vibration />
      <Drawer.Navigator initialRouteName={Screens.CLIENT_LIST} drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name={Screens.ADD_TABLE} component={AddTableStack} options={{ headerShown: false }} />
        <Drawer.Screen name={Screens.ADD_CLIENT} component={AddClientScreen} />
        <Drawer.Screen name={Screens.LIST_CHAT} component={ChatStack} options={{ headerShown: false }} />
        <Drawer.Screen name={Screens.CLIENT_LIST} component={ClientListScreen} />
        <Drawer.Screen name={Screens.WAITING_CLIENT_LIST} component={WaitingClientListStack} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </>
  );
}

export default DrawerStack