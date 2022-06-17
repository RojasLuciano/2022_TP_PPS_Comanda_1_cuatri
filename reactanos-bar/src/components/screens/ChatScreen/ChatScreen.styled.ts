import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { Dimensions } from "react-native";

export const StyledView = styled(LinearGradient)`
    height:100%;
    width:100%;
`

export const StyledLinearGradient = styled(LinearGradient)`
min-height: ${Dimensions.get('window').height}px;
align-items:center;
padding:5%;
`

export const StyledMargin = styled.View`
    margin-vertical:1px;
    width:100%;
`

