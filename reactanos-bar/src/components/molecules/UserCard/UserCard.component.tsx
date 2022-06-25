import React, { FC } from "react";
import {
    StyledGroup,
    StyledImageContainer,
    StyledInfoContainer,
    StyledView,
} from "./UserCard.styled";
import Button from "../../atoms/Button/Button.component";
import Heading from "../../atoms/Heading/Heading.component";
import Paragraph from "../../atoms/Paragraph/Paragraph.component";
import { Avatar } from "native-base";
import { View } from 'react-native'

interface UserCardProps {
    name?: string;
    lastName?: string;
    email?: string;
    dni?: string;
    image?: string;
    onPress?: () => void;
    user?: string;
    state?: string;
    table?:string;
    total?:string;
    onPressActive?: () => void;
    onPressCancel?: () => void;
}

const UserCard: FC<UserCardProps> = ({
    name,
    lastName,
    email,
    dni,
    image,
    onPress,
    user,
    state,
    table,
    total,
    onPressActive, onPressCancel
}) => {
    return (
        <StyledView>
            <StyledImageContainer>
                <Paragraph level="M" color="black" textAlign="left">
                    {user}
                </Paragraph>
                <Avatar size={110} source={{ uri: image }}></Avatar>
                <Paragraph level="M" color="black" textAlign="left">
                    {state}
                </Paragraph>
            </StyledImageContainer>
            <StyledInfoContainer>
                <Heading level="L">
                    {name} {lastName}
                </Heading>
                <View style={{ alignSelf: "flex-start" }}>
                    {email && (
                        <>
                            <Paragraph level="S" color="gray" textAlign="left">
                                Correo:
                            </Paragraph>
                            <Paragraph level="M" textAlign="left">
                                {email}
                            </Paragraph>
                        </>
                    )}
                    {dni && (
                        <>
                            <Paragraph level="S" color="gray" textAlign="left">
                                DNI:
                            </Paragraph>
                            <Paragraph textAlign="left">{dni}</Paragraph>
                        </>
                    )}
                    {table && (
                        <>
                            <Paragraph level="S" color="gray" textAlign="left">
                                Mesa:
                            </Paragraph>
                            <Paragraph textAlign="left">{table}</Paragraph>
                        </>
                    )}
                    {total && (
                        <>
                            <Paragraph level="S" color="gray" textAlign="left">
                                Importe total:
                            </Paragraph>
                            <Paragraph textAlign="left">{total}</Paragraph>
                        </>
                    )}
                </View>
                <StyledGroup>
                    <Button variant='primary' onPress={onPress || onPressActive} size="M" marginH="M">Aceptar</Button>
                    {onPressCancel && <Button variant='secondary' size="M" onPress={onPressCancel}>Retirar</Button>}
                </StyledGroup>
            </StyledInfoContainer>
        </StyledView>
    );
};

export default UserCard;
