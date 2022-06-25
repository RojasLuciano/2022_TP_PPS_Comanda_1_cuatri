import styled from "styled-components/native";

interface HeadingProps{
    color: string;
    bold:boolean;
    level: "XL" | "L" | "M";
    textAlign: 'left' | 'center' | 'right';
}

const sizes = {XL: '30px', L: '25px', M:'20px'}

export const StyledHeading = styled.Text<HeadingProps>`
    text-align:${({textAlign})=>textAlign};
    font-size:${({level})=> sizes[level]};
    font-weight:${({bold})=>bold?'bold':'normal'};
    color:${({color})=>color};
`