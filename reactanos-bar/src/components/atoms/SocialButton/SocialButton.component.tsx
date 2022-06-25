import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { StyledButton, StyledImage } from './SocialButton.styled'

interface ImageButtonProps{
    source:ImageSourcePropType;
    onPress?:()=>void
}

const ImageButton:FC<ImageButtonProps> = ({source, onPress}) => {
  return (
    <StyledButton onPress={onPress}>
        <StyledImage source={source} resizeMode="cover" />
    </StyledButton>
  )
}

export default ImageButton