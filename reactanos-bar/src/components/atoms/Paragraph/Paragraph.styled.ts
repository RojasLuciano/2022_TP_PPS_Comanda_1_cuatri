import styled from "styled-components/native";

interface ParagraphProps{
    color: string;
    bold:boolean;
    level: "XL" | "L" | "M";
    textAlign: 'left' | 'center' | 'right';
}

const sizes = {XL: '18px', L: '16px', M:'14px', S:'12px'}

export const StyledParagraph = styled.Text<ParagraphProps>`
    text-align:${({textAlign})=>textAlign};
    font-size:${({level})=> sizes[level]};
    font-weight:${({bold})=>bold?'bold':'normal'};
    color:${({color})=>color};
`