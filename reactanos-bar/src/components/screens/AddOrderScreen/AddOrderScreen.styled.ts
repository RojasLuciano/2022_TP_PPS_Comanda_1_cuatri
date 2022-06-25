import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

export const StyledView = styled(LinearGradient)`
    height:100%;
    align-items:center;
    width:100%;
`

export const StyledCard = styled.View`
    background-color:white;
    flex-direction:column
    justify-content:space-between;
    width:100%;
    padding-vertical:3%;
    padding-horizontal:5%;
    border-top-left-radius:25px;
    border-top-right-radius:25px;
`

export const StyledRow = styled.View`
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-vertical:2%;
`