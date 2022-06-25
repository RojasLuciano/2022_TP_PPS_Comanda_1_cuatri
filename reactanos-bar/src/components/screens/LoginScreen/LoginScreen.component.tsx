import React from "react";
import { LoginStackParamList } from '../../../navigation/stacks/LoginStack';
import { Screens } from "../../../navigation/Screens";
import { StyledView } from "./LoginScreen.styled";
import { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageBackground } from 'react-native';
import LoginController from "../../organisms/LoginController/LoginController.component";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../../redux/authReducer";
import { FormData } from "../../../models/login/formData.types";
import { validateInputs } from '../../../utils/utils';
import { errorHandler } from '../../../utils/ErrorsHandler';
import { ConfigurationTypes } from "../../../redux/configurationReducer";
import { IStore } from "../../../redux/store";

type LoginScreenProps = NativeStackScreenProps<LoginStackParamList, Screens.LOGIN>;

const LoginScreen:FC<LoginScreenProps> = ({navigation}) => {
    const {control, handleSubmit, getValues, setValue} = useForm<FormData>();
	const dispatch = useDispatch();
    const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);

    const handleFastSignIn = (data:FormData) => {
        setValue("email", data.email);
        setValue("password", data.password);
    }

	const handleSignIn = () => {
        try {
            const values = getValues();
            validateInputs(values);
            dispatch(handleLogin(values));
        } catch (error:any) {
            errorHandler(error.code, configuration.vibration)
        }
    }

	return (
		<StyledView >
            <ImageBackground style={{height:'100%', width:'100%', justifyContent:'flex-end'}} source={require('../../../../assets/loginBg.png')}>
                <LoginController fastSignIn={handleFastSignIn} onSubmit={handleSubmit(handleSignIn)} control={control} />              
            </ImageBackground>
        </StyledView>
	);
};

export default LoginScreen;
