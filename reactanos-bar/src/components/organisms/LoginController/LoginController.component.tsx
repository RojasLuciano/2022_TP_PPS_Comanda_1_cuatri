import React, { FC, MutableRefObject, useRef, useState } from "react";
import InputGroup from "../../molecules/InputGroup/InputGroup.component";
import Button from "../../atoms/Button/Button.component";
import { StyledAccess, StyledSocials, StyledView } from "./LoginController.styled";
import { Control } from "react-hook-form";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import ControlledPassword from "../../molecules/ControlledPassword/ControlledPassword.component";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View, Linking } from "react-native";
import { Screens } from "../../../navigation/Screens";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "../../../navigation/stacks/LoginStack";
import SocialButton from "../../atoms/SocialButton/SocialButton.component";

interface LoginControllerProps {
    control: Control<any, any>;
    onSubmit: () => void;
    fastSignIn: (data:any) => void;
}

const LoginController: FC<LoginControllerProps> = ({ control, onSubmit, fastSignIn }) => {
    const passInput: MutableRefObject<any> = useRef();
    const [show, setShow] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<LoginStackParamList>>()

    const handlerSignUp = () => {
        navigation.navigate(Screens.SIGNUP);   
    }

    const handleInstagram = async () => {
        await Linking.openURL('instagram://user?username=reactanosbar')
    }
    const handleFacebook = async () => {
        await Linking.openURL('fb://page/ezee.matias')
    }

    return (
        <StyledView>
            <InputGroup>
                <ControlledInput
                    icon={<MaterialIcons name="person" />}
                    onSubmitEditing={() => passInput.current.focus()}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    control={control}
                    name="email" 
                />
                <ControlledPassword
                    icon={<MaterialIcons name="lock" />}
                    show={show}
                    rightIcon={
                        <MaterialIcons
                            name={show ? "visibility" : "visibility-off"}
                        />
                    }
                    onPressRight={() => setShow(!show)}
                    ref={passInput}
                    placeholder="Contraseña"
                    name="password"
                    control={control}
                />
            </InputGroup>
            <Button onPress={onSubmit}>Iniciar sesión</Button>
            <TouchableOpacity
                onPress={handlerSignUp}
            >
                <Text>Si no tenés cuenta, ¡Registrate acá!</Text>
            </TouchableOpacity>
            <StyledAccess>
                <Button
                    onPress={()=>fastSignIn({email:"cliente@gmail.com", password:"123456"})}
                    size='M'
                >
                    <Text>Cliente</Text>
                </Button>
                <Button
                    onPress={()=>fastSignIn({email:"admin@reactanosbar.com", password:"123456"})}
                    size='M'
                    marginH="M"
                >
                    <Text>Admin</Text>
                </Button>
                <Button
                    onPress={()=>fastSignIn({email:"empleado@reactanosbar.com", password:"123456"})}
                    size='M'
                >
                    <Text>Empleado</Text>
                </Button>
            </StyledAccess>
            <StyledSocials>
                <SocialButton
                    source={require("../../../../assets/ig.png")}
                    onPress={handleInstagram}
                />
                <SocialButton
                    source={require("../../../../assets/fb.png")}
                    onPress={handleFacebook}
                />
            </StyledSocials>
        </StyledView>
    );
};

export default LoginController;
