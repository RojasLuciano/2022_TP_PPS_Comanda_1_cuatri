import React, { FC } from 'react'
import Button from '../../atoms/Button/Button.component';
import {Modal as ModalView} from 'react-native';
import { StyledFullWidth, StyledView, StyledModalView } from './Modal.styled';
import Paragraph from '../../atoms/Paragraph/Paragraph.component';
import Heading from '../../atoms/Heading/Heading.component';

interface ModalProps{
    isVisible:boolean;
    onPrimary:()=>void;
    onSecondary?:()=>void;
    title:string;
    subtitle?:string;
    onPrimaryText:string;
    onSecondaryText?:string;
}

const Modal:FC<ModalProps> = ({title, subtitle, onSecondaryText, onPrimaryText, isVisible, onPrimary, onSecondary}) => {
  return (
    <ModalView style={{elevation:10,zIndex:0}} transparent animationType='fade' visible={isVisible}>
        <StyledModalView>
        <StyledView>
            <StyledFullWidth>
                <Heading>{title}</Heading>
                <Paragraph>{subtitle}</Paragraph>
            </StyledFullWidth>
            <StyledFullWidth>
                <Button onPress={onPrimary}>{onPrimaryText}</Button>
                {onSecondary && onSecondaryText && <Button variant='secondary' onPress={onSecondary}>{onSecondaryText}</Button>}
            </StyledFullWidth>
        </StyledView>
        </StyledModalView>
    </ModalView>
  )
}

export default Modal