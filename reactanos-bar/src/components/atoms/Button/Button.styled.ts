import styled from "styled-components/native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

interface ButtonProps{
    variant: "primary" | "secondary";
}

export const StyledPrimary = styled.TouchableOpacity<ButtonProps>`
    height:${({variant})=>variant==="primary"?"60px":"40px"};
    width:100%;
    border-radius:15px;
    overflow:hidden;
    margin-vertical:5px;
`

export const StyledText = styled.Text<ButtonProps>`
    color:${({variant})=>variant==="primary" ? 'white': '#858cc4'};
    font-size:17px;
`

export const StyledSecondaryView = styled.View<ButtonProps>`
    border-radius:13px;
    align-items:center;
    justify-content:center;
    height:100%;
    width:100%;
    background-color:${({variant})=>variant==="primary"?"transparent":"white"};
`

export const StyleGradient = styled(LinearGradient)<LinearGradientProps>`
    flex:1;
    padding:2px;
    justify-content:center;
    align-items:center;
`