import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../Screens';
import React from 'react';
import LoginScreen from '../../components/screens/LoginScreen/LoginScreen.component';
import SignUpScreen from '../../components/screens/SignUpScreen/SignUpScreen.component';

export type LoginStackParamList = {
    [Screens.LOGIN]: undefined | {};
    [Screens.ADD_CLIENT]: undefined | {};
    [Screens.SIGNUP]: undefined | {};
};
const Stack = createStackNavigator<LoginStackParamList>();

const LoginStack = () => {
  return (
    <Stack.Navigator initialRouteName={Screens.LOGIN} screenOptions={{headerShown:false}}>
        <Stack.Screen name={Screens.LOGIN} component={LoginScreen} />
        <Stack.Screen options={{headerShown:true}} name={Screens.SIGNUP} component={SignUpScreen} />
    </Stack.Navigator>
  );
}

export default LoginStack