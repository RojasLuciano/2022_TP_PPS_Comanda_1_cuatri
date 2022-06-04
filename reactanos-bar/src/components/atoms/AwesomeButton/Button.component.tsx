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
      <Button type={props.type} {...props} stretch
        width={props.width} borderRadius={props.rounded?40:0}
        textSize={props.textSize} height={props.height}
        onPress={props.onPress}
      >
        {props.children}
      </Button>
  )
}

export default AwesomeButton