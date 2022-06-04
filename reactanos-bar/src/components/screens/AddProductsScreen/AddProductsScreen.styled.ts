import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import styled from "styled-components/native";

export const StyledView = styled.ScrollView`
`

export const StyledLinearGradient = styled(LinearGradient)`
    min-height: ${Dimensions.get('window').height}px;
    align-items:center;
    padding:5%;
`

export const StyledMargin = styled.View`
    margin-vertical:15px;
    width:100%;
`