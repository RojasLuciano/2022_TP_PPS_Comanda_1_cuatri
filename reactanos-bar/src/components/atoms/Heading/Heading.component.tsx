import React, { FC } from 'react'
import { StyledHeading } from './Heading.styled'
import { TextProps } from 'react-native';

interface HeadingProps extends TextProps{
  color?: 'primary' | 'secondary' | 'tertiary';
  textAlign?: 'left' | 'center' | 'right';
}

const Heading:FC<HeadingProps> = ({children, color='primary', textAlign='center',...props}) => {
  return (
      <StyledHeading textAlign={textAlign} color={color} {...props}>{children}</StyledHeading>
  )
}

export default Heading