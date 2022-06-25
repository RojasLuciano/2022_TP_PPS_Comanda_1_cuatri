import { LinearGradient } from 'expo-linear-gradient';
import styled from "styled-components/native";

export const StyledView = styled(LinearGradient)`
    height:100%;
    align-items:center;
    padding-horizontal:5%;
    padding-vertical:10%;
`

export const StyledTextContainer = styled.View`
    justify-content:space-between;
    height:35%;
    align-items:center;
    margin-bottom:10%;
`

export const StyledQR = styled.View`
    justify-content:center;
    height:60%;
    align-items:center;
    margin-bottom:10%;
`