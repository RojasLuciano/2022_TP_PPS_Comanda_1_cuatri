import React, { FC, useState } from 'react'
import Button from '../../atoms/Button/Button.component';
import {Modal as ModalView} from 'react-native';
import { StyledFullWidth, StyledView, StyledModalView, StyledRow } from './Modal.styled';
import Paragraph from '../../atoms/Paragraph/Paragraph.component';
import Heading from '../../atoms/Heading/Heading.component';
import { Switch } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import store, { IStore } from '../../../redux/store';
import { ConfigurationTypes, handleConfigureSound, handleConfigureVibration } from '../../../redux/configurationReducer';

interface ModalProps{
    isVisible:boolean;
    onPrimary:()=>void;
    onSecondary?:()=>void;
    title:string;
    subtitle?:string;
    onPrimaryText:string;
    onSecondaryText?:string;
    sound?:boolean;
    vibration?:boolean;
}

const Modal:FC<ModalProps> = ({title, subtitle, onSecondaryText, onPrimaryText, isVisible, onPrimary, onSecondary, sound, vibration}) => {

    const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);
    const dispatch = useDispatch();

    const handleSound = (value:boolean) => {
        dispatch(handleConfigureSound(value))
    }

    const handleVibration = (value:boolean) => {
        dispatch(handleConfigureVibration(value))
    }

  return (
    <ModalView style={{elevation:10,zIndex:0}} transparent animationType='fade' visible={isVisible}>
        <StyledModalView>
        <StyledView>
            <StyledFullWidth>
                <Heading level='L' textAlign='center'>{title}</Heading>
            </StyledFullWidth>
            {sound && 
                <StyledRow>
                    <Heading level='M' textAlign='left'>Sonido:</Heading>
                    <Switch size="lg" onValueChange={value => handleSound(value)} defaultIsChecked={configuration.sound} isChecked={configuration.sound} />
                </StyledRow>

            }
            {vibration && 
                <StyledRow>
                    <Heading level='M' textAlign='left'>Vibración:</Heading>
                    <Switch size="lg" onValueChange={value => handleVibration(value)} defaultIsChecked={configuration.vibration} isChecked={configuration.vibration} />
                </StyledRow>
            }
            {subtitle && <StyledFullWidth>
                <Paragraph>{subtitle}</Paragraph>
            </StyledFullWidth>}
            <StyledFullWidth>
                <Button onPress={onPrimary}>{onPrimaryText}</Button>
                {onSecondary && onSecondaryText && <Button size='M' variant='secondary' onPress={onSecondary}>{onSecondaryText}</Button>}
            </StyledFullWidth>
        </StyledView>
        </StyledModalView>
    </ModalView>
  )
}

export default Modal