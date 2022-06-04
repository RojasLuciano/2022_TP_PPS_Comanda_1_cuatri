import React, { FC, MutableRefObject, useRef, useState } from "react";
import InputGroup from "../../molecules/InputGroup/InputGroup.component";
import Button from "../../atoms/Button/Button.component";
import { StyledView } from "./LoginController.styled";
import { Control } from "react-hook-form";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import ControlledPassword from "../../molecules/ControlledPassword/ControlledPassword.component";
import { MaterialIcons } from "@expo/vector-icons";

interface LoginControllerProps {
    control: Control<any, any>;
    onSubmit: () => void;
}

const LoginController: FC<LoginControllerProps> = ({ control, onSubmit }) => {
    const passInput: MutableRefObject<any> = useRef();
    const [show, setShow] = useState(false);

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
        </StyledView>
    );
};

export default LoginController;
