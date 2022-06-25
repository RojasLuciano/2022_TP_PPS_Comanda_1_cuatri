import { TextInput } from 'react-native'
import React, { Ref } from 'react'
import { Control, Controller } from 'react-hook-form'
import { InputProps } from '../../atoms/Input/Input.component'
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import styles from './ControlledCurrency.styled';

interface ControlledInputProps extends InputProps{
    control:Control<any,any>;
    placeholder:string;
    type?: "default" | "email-address" | "numeric";
    name:string;
    number?:boolean;
    error?:boolean;
    required?:boolean;
    onSubmitEditing?:any
}

const ControlledCurrency = React.forwardRef((props:ControlledInputProps,ref:Ref<TextInput> | undefined) => {

  const mask = props.number ? createNumberMask({
    delimiter: '.',
    separator: ',',
    precision: 0,
  }) : createNumberMask({
    prefix: ['$', ' '],
    delimiter: '.',
    separator: ',',
    precision: 2,
  })

  return (
    <Controller control={props.control} name={props.name} rules={{required:props.required}}
        render={({ field: { onChange, onBlur, value } }) => (
            <MaskInput style={[styles.input, props.error && {borderColor:'red', borderWidth:1.5}]} placeholderTextColor="gray" ref={ref}
                value={value} placeholder={props.placeholder} keyboardType="number-pad"
                onChangeText={(masked, unmasked) => {
                    onChange(unmasked);
                }} maxLength={props.maxLength}
                    returnKeyType="next"
                    mask={mask} onSubmitEditing={props.onSubmitEditing}
              />
        )}
    />
  )
})

export default ControlledCurrency