import React, { useEffect } from "react";
import { LoginStackParamList } from '../../../navigation/stacks/LoginStack';
import { Screens } from "../../../navigation/Screens";
import { StyledView } from "./LoginScreen.styled";
import { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageBackground } from 'react-native';
import LoginController from "../../organisms/LoginController/LoginController.component";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { handleLogin } from "../../../redux/authReducer";
import { FormData } from "../../../models/login/formData.types";
import Button from "../../atoms/Button/Button.component";
import { sendPushNotification } from "../../../utils/pushNotifications";
import { validateInputs } from '../../../utils/utils';
import { errorHandler } from '../../../utils/ErrorsHandler';

type LoginScreenProps = NativeStackScreenProps<LoginStackParamList, Screens.LOGIN>;

const LoginScreen:FC<LoginScreenProps> = ({navigation}) => {
    const {control, handleSubmit, getValues, setValue} = useForm<FormData>();
	const dispatch = useDispatch();

    useEffect(() => {
        setValue("email", "admin@gmail.com");
        setValue("password", "Admin1234");
    }, [])


	const handleSignIn = () => {
        try {
            const values = getValues();
            validateInputs(values);
            dispatch(handleLogin(values));
        } catch (error:any) {
            errorHandler(error.code)
        }
    }

	return (
		<StyledView >
            <ImageBackground style={{height:'100%', width:'100%', justifyContent:'flex-end'}} source={require('../../../../assets/loginBg.png')}>
                <Button onPress={()=>sendPushNotification({title:"Prueba",description:"pruebita"})}>Presione</Button>
                <LoginController onSubmit={handleSubmit(handleSignIn)} control={control} />
            </ImageBackground>
        </StyledView>
	);
};

export default LoginScreen;
