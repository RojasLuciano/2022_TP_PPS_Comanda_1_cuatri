import React, { FC, MutableRefObject, useRef, useState } from "react";
import InputGroup from "../../molecules/InputGroup/InputGroup.component";
import Button from "../../atoms/Button/Button.component";
import { StyledAccess, StyledView } from "./LoginController.styled";
import { Control } from "react-hook-form";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import ControlledPassword from "../../molecules/ControlledPassword/ControlledPassword.component";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";
import { Screens } from "../../../navigation/Screens";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "../../../navigation/stacks/LoginStack";

interface LoginControllerProps {
    control: Control<any, any>;
    onSubmit: () => void;
}

const LoginController: FC<LoginControllerProps> = ({ control, onSubmit }) => {
    const passInput: MutableRefObject<any> = useRef();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation<NativeStackNavigationProp<LoginStackParamList>>()

    const handlerSignUp = () => {
        navigation.navigate(Screens.SIGNUP);
    }

    const guestLogin = () => {
        setEmail("cliente@gmail.com");
        setPassword("123456");
    }

    const adminLogin = () => {
        setEmail("admin@reactanosbar.com");
        setPassword("123456");
    }

    const supplierLogin = () => {
        setEmail("empleado@reactanosbar.com");
        setPassword("123456");
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
                    value={email}
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
                    value={password}
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
                    onPress={guestLogin}   
                    size='M'
                    >
                    <Text>Cliente</Text>
                </Button>
                <Button
                    onPress={adminLogin} 
                    size='M'
                    marginH="M"                   
                    >
                    <Text>Admin</Text>
                </Button>
                <Button
                    onPress={supplierLogin}
                    size='M'
                    >
                    <Text>Empleado</Text>
                </Button>

                </StyledAccess>
        </StyledView>


    );
};

export default LoginController;
