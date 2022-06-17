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
}

const ControlledCurrency = React.forwardRef((props:ControlledInputProps,ref:Ref<TextInput> | undefined) => {

  const mask = createNumberMask({
    prefix: ['$', ' '],
    delimiter: '.',
    separator: ',',
    precision: 2,
  })

  return (
    <Controller control={props.control} name={props.name}
        render={({ field: { onChange, onBlur, value } }) => (
            <MaskInput style={styles.input} placeholderTextColor="gray" ref={ref}
                value={value} placeholder={props.placeholder} keyboardType="number-pad"
                onChangeText={(masked, unmasked) => {
                    onChange(unmasked);
                }}
                mask={mask}
              />
        )}
    />
  )
})

export default ControlledCurrency