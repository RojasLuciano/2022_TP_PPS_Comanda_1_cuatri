import React, { FC } from 'react'
import { View } from 'react-native';
import { StyledPrimary, StyledSecondaryView, StyledText, StyleGradient } from './Button.styled'

interface ButtonProps{
    onPress: () => void;
    variant?: "primary" | "secondary";
    size?: "L" | "M";
}

const Button:FC<ButtonProps> = ({children, onPress, variant="primary", size="L"}) => {

    return (
        <StyledPrimary size={size} variant={variant} onPress={onPress}>
            <StyleGradient colors={["#1c1e3d", "#858cc4"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} >
                <StyledSecondaryView variant={variant}>
                    <StyledText variant={variant}>
                        {children}
                    </StyledText>
                </StyledSecondaryView>
            </StyleGradient>
        </StyledPrimary>
    )
}

export default Button