import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { Control, Controller, RefCallBack } from 'react-hook-form'
import Input, { InputProps } from '../../atoms/Input/Input.component'
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import styles from './ControlledCurrency.styled';

interface ControlledInputProps extends InputProps{
    control:Control<any,any>;
    placeholder:string;
    type?: "default" | "email-address" | "numeric";
    name:string;
    ref?:any;
}

const ControlledCurrency = React.forwardRef((props:ControlledInputProps,ref) => {

  const mask = createNumberMask({
    prefix: ['$', ' '],
    delimiter: '.',
    separator: ',',
    precision: 2,
  })

  return (
    <Controller control={props.control} name={props.name}
        render={({ field: { onChange, onBlur, value } }) => (
            <MaskInput style={styles.input} placeholderTextColor="gray"
                value={value} placeholder={props.placeholder} keyboardType="number-pad"
                onChangeText={(masked, unmasked) => {
                    onChange(masked);
                }}
                mask={mask}
              />
        )}
    />
  )
})

export default ControlledCurrency