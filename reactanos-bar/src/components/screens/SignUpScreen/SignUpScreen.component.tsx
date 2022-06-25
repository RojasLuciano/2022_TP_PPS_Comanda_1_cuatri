import React from "react";
import { LoginStackParamList } from '../../../navigation/stacks/LoginStack';
import { Screens } from "../../../navigation/Screens";
import { StyledView } from "./SignUpScreen.styled";
import { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";import { ImageBackground } from 'react-native';
import AddClientScreen from "../AddClient/AddClientScreen.component";

type SignUpScreenProps = NativeStackScreenProps<LoginStackParamList, Screens.LOGIN>;

const SignUpScreen:FC<SignUpScreenProps> = ({navigation}) => {
	return (
		<StyledView >
            <ImageBackground style={{height:'100%', width:'100%', justifyContent:'flex-end'}} source={require('../../../../assets/loginBg.png')}>
                <AddClientScreen />
            </ImageBackground>
        </StyledView>
	);
};

export default SignUpScreen;
