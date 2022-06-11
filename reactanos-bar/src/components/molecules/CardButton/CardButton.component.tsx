import { TouchableOpacityProps } from 'react-native';
import React, { FC } from 'react'
import { StyledView } from './CardButton.styled'
import Heading from '../../atoms/Heading/Heading.component';

interface CardButtonProps extends TouchableOpacityProps{
    children:string;
}

const CardButton:FC<CardButtonProps> = ({children, onPress}) => {
  return (
    <StyledView onPress={onPress}>
        <Heading textAlign='left' level='L'>{children}</Heading>
    </StyledView>
  )
}

export default CardButton