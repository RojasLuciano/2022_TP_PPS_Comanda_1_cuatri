import React, { FC } from 'react'
import { TextProps } from 'react-native';
import { ParagraphXL, ParagraphL, ParagraphM } from './Paragraph.styled';

interface ParagraphProps extends TextProps{
    children:React.ReactNode;
    level?:1 | 2 | 3 | 4;
    color?:string;
    bold?:boolean;
    textAlign?:'center' | 'left' | 'right';
}

const ParagraphVariants = {1: ParagraphXL, 2: ParagraphL, 3: ParagraphM}

const Paragraph:FC<ParagraphProps> = ({
    children,
    level=2,
    color="#257FA4",
    bold=false,
    textAlign='center',
    ...props
}) => {
  const ParagraphLevel = ParagraphVariants[level];
  return (
      <ParagraphLevel
        testID='paragraph'
        textAlign={textAlign}
        color={color}
        bold={bold}
        {...props}
      >
        {children}
      </ParagraphLevel>
  )
}

export default Paragraph