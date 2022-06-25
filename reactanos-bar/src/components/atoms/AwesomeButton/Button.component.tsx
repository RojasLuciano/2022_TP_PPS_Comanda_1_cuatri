import React, { FC } from 'react'
import { AwesomeButtonProps } from 'react-native-really-awesome-button';
import Button from 'react-native-really-awesome-button';

export interface ButtonProps extends AwesomeButtonProps{
    onPress:()=>void;
    rounded?:boolean;
    type?: 'primary' | 'secondary';
}

const AwesomeButton:FC<ButtonProps> = (props) => {
  return (
      <Button type={props.type} {...props} backgroundColor="#A7BFE8" backgroundDarker='#6190E8'
        width={props.width || 40} borderRadius={props.rounded?40:0}
        textSize={props.textSize || 25} height={props.height || 40}
        onPress={props.onPress}
      >
        {props.children}
      </Button>
  )
}

export default AwesomeButton