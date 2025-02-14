import { View, Text } from "react-native";
import React, { FC } from "react";
import { Control, Controller, RefCallBack } from "react-hook-form";
import Input, { InputProps } from "../../atoms/Input/Input.component";

interface ControlledInputProps extends InputProps {
    control: Control<any, any>;
    placeholder: string;
    type?: "default" | "email-address" | "numeric";
    name: string;
    ref?: any;
    icon?: any;
    error?:boolean;
    required?:boolean;
}

const ControlledInput = React.forwardRef((props: ControlledInputProps, ref) => {
    return (
        <Controller
            control={props.control}
            name={props.name}
            rules={{
                required: props.required,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
                <Input error={props.error}
                    icon={props.icon}
                    autoCapitalize={props.autoCapitalize}
                    keyboardType={props.type}
                    returnKeyType="next"
                    ref={ref}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    {...props}
                />
            )}
        />
    );
});

export default ControlledInput;
