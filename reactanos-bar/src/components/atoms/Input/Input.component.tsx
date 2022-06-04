import React, { FC } from "react";
import { TextInputProps } from "react-native";
import { Icon, Input as NativeInput } from "native-base";
import styles from "./Input.styled";

export interface InputProps extends TextInputProps {
    variant?: "outline" | "unstyled" | "rounded";
    ref?: any;
    icon?: any;
    rightIcon?: any;
    onPressRight?: () => void;
}

const Input = React.forwardRef((props: InputProps, ref) => {
    return (
        <NativeInput
            InputRightElement={
                props.rightIcon && (
                    <Icon
                        as={props.rightIcon}
                        size={5}
                        m="2"
                        color="muted.400"
                        onPress={props.onPressRight}
                    />
                )
            }
            InputLeftElement={
                props.icon && (
                    <Icon as={props.icon} size={5} m="2" color="muted.400" />
                )
            }
            style={styles.input}
            ref={ref}
            variant={props.variant}
            {...props}
        />
    );
});

export default Input;
