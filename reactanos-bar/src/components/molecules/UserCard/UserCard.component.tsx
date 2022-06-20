import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { StyledGroup, StyledImageContainer, StyledInfoContainer, StyledView } from './UserCard.styled';
import Button from '../../atoms/Button/Button.component';
import Heading from '../../atoms/Heading/Heading.component';
import Paragraph from '../../atoms/Paragraph/Paragraph.component';
import { Avatar } from 'native-base';

interface UserCardProps {
    name?: string;
    lastName?: string;
    email?: string;
    dni?: string;
    image?: string;
    onPressActive: () => void;
    onPressCancel: () => void;
    user?: string;
    state?: string;
}

const UserCard: FC<UserCardProps> = ({ name, lastName, email, dni, image, onPressActive, onPressCancel, user, state }) => {
    return (
        <StyledView>
            <StyledImageContainer>
                <Paragraph level='M' color="black" textAlign='left'>{user}</Paragraph>
                <Avatar size={110} source={{ uri: image }}></Avatar>
                <Paragraph level='M' color="black" textAlign='left'>{state}</Paragraph>
            </StyledImageContainer>
            <StyledInfoContainer>
                <Heading level='L' >{name} {lastName}</Heading>
                <View style={{ alignSelf: 'flex-start' }}>
                    <Paragraph level='S' color='gray' textAlign='left'>Correo:</Paragraph>
                    <Paragraph level='M' textAlign='left'>{email}</Paragraph>
                    <Paragraph level='S' color='gray' textAlign='left'>DNI:</Paragraph>
                    <Paragraph textAlign='left'>{dni}</Paragraph>
                </View>
                <StyledGroup>
                    <Button variant='primary' onPress={onPressActive} marginH="M">Aceptar</Button>
                    <Button variant='secondary' onPress={onPressCancel}>Retirar</Button>
                </StyledGroup>
            </StyledInfoContainer>
        </StyledView>
    )
}

export default UserCard