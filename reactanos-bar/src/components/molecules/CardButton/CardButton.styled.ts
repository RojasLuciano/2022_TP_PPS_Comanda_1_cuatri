import styled from "styled-components/native";
import { TouchableOpacityProps } from 'react-native';

export const StyledView = styled.TouchableOpacity<TouchableOpacityProps>`
    width:100%;
    height:80px;
    padding-horizontal:30px;
    justify-content:center;
    border-radius:10px;
    background-color:${({disabled}) => disabled ? 'gray' : 'white'};
    shadow-color: #000;
    shadow-offset: 0px 10px;
    shadow-opacity: 0.3;
    shadow-radius: 10px;
`