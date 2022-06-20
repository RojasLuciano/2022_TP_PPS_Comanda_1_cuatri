import styled from "styled-components/native";

export const StyledView = styled.View`
    height:200px;
    background-color:white;
    flex-direction:row;
    border-radius:20px;
    overflow:hidden;
    elevation:20;
    margin-vertical:10px;
`

export const StyledImageContainer = styled.View`
    width: 140px;
    background-color:#bdc3c7;
    justify-content:space-evenly;
    align-items:center;
`

export const StyledInfoContainer = styled.View`
    flex:1;
    padding:2%;
    align-items:center;
    justify-content:space-between;
`

export const StyledGroup = styled.View`
    flexDirection: row;
    width: 45%;
    margin-left: -5%;
    justifyContent: center;
    alignItems: center;    
`