import React, { FC, MutableRefObject, useRef, useState } from "react";
import InputGroup from "../../molecules/InputGroup/InputGroup.component";
import Button from "../../atoms/Button/Button.component";
import SocialButton from "../../atoms/SocialButton/SocialButton.component";
import { StyledSocials, StyledView } from "./LoginController.styled";
import { Control } from "react-hook-form";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import ControlledPassword from "../../molecules/ControlledPassword/ControlledPassword.component";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text, Linking, View, Image, FlatList } from "react-native";
import { Screens } from "../../../navigation/Screens";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "../../../navigation/stacks/LoginStack";
import { imageHandler } from "./LoginController.handle"

interface LoginControllerProps {
    control: Control<any, any>;
    onSubmit: () => void;
    fastSignIn: (data: any) => void;
}

const LoginController: FC<LoginControllerProps> = ({ control, onSubmit, fastSignIn }) => {
    const passInput: MutableRefObject<any> = useRef();
    const [show, setShow] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<LoginStackParamList>>()

    const emailConstructor = (email: string) => {
        return email.toLocaleLowerCase() + "@reactanosbar.com"
    }

    const LOGIN_NAMES = [
        {
            id: 1,
            name: 'administrador',
        },
        {
            id: 2,
            name: 'supervisor',
        },
        {
            id: 3,
            name: 'cocinero',
        },
        {
            id: 4,
            name: 'mozo',
        },
        {
            id: 5,
            name: 'metre',
        },
        {
            id: 6,
            name: 'cliente',
        }
    ];

    const ItemRender = ({ name }: any) => (
        <TouchableOpacity
            onPress={() => fastSignIn({ email: emailConstructor(name), password: "123456" })}
        >
            <Image
                source={imageHandler(name)}
                resizeMode="center"
                style={{ height: 90, width: 90, marginTop: 15 }}
            />
        </TouchableOpacity>
    );

    const Separator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: 1,
                    backgroundColor: "white",                    
                }}
            />
        );
    }

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
            <InputGroup>
                <ControlledInput
                    icon={<MaterialIcons name="person" />}
                    onSubmitEditing={() => passInput.current.focus()}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    control={control}
                    name="email"
                    autoCapitalize="none"
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
            <FlatList
                data={LOGIN_NAMES}
                renderItem={({ item }) => <ItemRender name={item.name} />}
                ItemSeparatorComponent={Separator}
                horizontal={true}
            />
        </StyledView>
    );
};

export default LoginController;
