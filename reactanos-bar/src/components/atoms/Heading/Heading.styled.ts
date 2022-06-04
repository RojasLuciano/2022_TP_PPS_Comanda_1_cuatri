import styled from "styled-components/native";

interface HeadingProps{
    color: 'primary' | 'secondary' | 'tertiary';
    textAlign: 'left' | 'center' | 'right';
}

const colorVariants = {primary: 'rgba(0,0,0,0.6)', secondary: 'rgba(0,0,0,0.4)', tertiary:'gray'}

export const StyledHeading = styled.Text<HeadingProps>`
    text-align:${({textAlign})=>textAlign};
    font-size:20px;
    font-weight:bold;
    color:${({color})=>colorVariants[color]};
`