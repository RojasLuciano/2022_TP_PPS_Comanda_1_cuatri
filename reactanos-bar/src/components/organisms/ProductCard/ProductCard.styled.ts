import styled from "styled-components/native";

export const StyledView = styled.View`
    background-color:white;
    align-items:center;
    elevation:10;
    shadow-offset:0px 4px;
    shadow-opacity:0.3;
    shadow-radius:10px;
    margin:20px;
    padding:30px;
    border-radius:20px;
`

export const StyledRow = styled.View`
    flex-direction:row;
    width:100%;
    margin-vertical:5px;
    justify-content:space-between;
`

export const StyledEnd = styled.View`
    flex-direction:row;
    width:100%;
    margin-top:10px;
    justify-content:flex-end;
`