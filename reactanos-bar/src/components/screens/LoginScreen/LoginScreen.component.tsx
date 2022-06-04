import React, { useEffect, useState } from "react";
import { LoginStackParamList } from '../../../navigation/stacks/LoginStack';
import { Screens } from "../../../navigation/Screens";
import { StyledView } from "./LoginScreen.styled";
import { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageBackground } from "react-native";
import LoginController from "../../organisms/LoginController/LoginController.component";
import { useForm } from "react-hook-form";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import { handleLogin } from "../../../redux/authReducer";
import { FormData } from "../../../models/login/formData.types";
import Button from "../../atoms/Button/Button.component";
import Spinner from "../../atoms/Spinner/Spinner.component";

type LoginScreenProps = NativeStackScreenProps<LoginStackParamList, Screens.LOGIN>;

const LoginScreen:FC<LoginScreenProps> = ({navigation}) => {

    const {control, handleSubmit, getValues, setValue} = useForm<FormData>();
	const dispatch = useDispatch();

    useEffect(() => {
        setValue("email", "admin@gmail.com");
        setValue("password", "Admin1234");
    }, [])


	const handleSignIn = () => {
        const values = getValues();
        if(!values.email || !values.password){
            showMessage({type:"danger", message:"Error", description:"Todos los campos son requeridos"});
            return
        }
        dispatch(handleLogin(values));
    }

	return (
		<StyledView >
			<ImageBackground style={{height:'100%', width:'100%', justifyContent:'flex-end'}} source={require('../../../../assets/loginBg.png')}>
				<LoginController onSubmit={handleSubmit(handleSignIn)} control={control} />
			</ImageBackground>
        </StyledView>
	);
};

export default LoginScreen;
