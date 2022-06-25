import React, { FC } from 'react'
import { TextProps } from 'react-native';
import { StyledParagraph } from './Paragraph.styled';

interface ParagraphProps extends TextProps{
    children:React.ReactNode;
    level?:"XL" | "L" | "M" | "S";
    color?:string;
    bold?:boolean;
    textAlign?:'center' | 'left' | 'right';
}

const Paragraph:FC<ParagraphProps> = ({
    children,
    level="M",
    color="#257FA4",
    bold=false,
    textAlign='center',
    ...props
}) => {
  return (
      <StyledParagraph
        testID='paragraph'
        textAlign={textAlign}
        color={color}
        bold={bold}
        level={level}
        {...props}
      >
        {children}
      </StyledParagraph>
  )
}

export default Paragraph