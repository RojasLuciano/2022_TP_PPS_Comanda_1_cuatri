import styled from 'styled-components/native'

interface ParagraphProps{
    color:string;
    bold:boolean;
    textAlign?: 'center' | 'left' | 'right';
}

const StyledParagraph = styled.Text<ParagraphProps>`
    color:${({color})=>color};
    font-weight:${({bold})=>bold?'bold':'normal'};
    text-align:${({textAlign})=>textAlign};
`

export const ParagraphXL = styled(StyledParagraph)`
    font-size:16px;
    line-height:24px;
`

export const ParagraphL = styled(StyledParagraph)`
    font-size:14px;
    line-height:20px;
`

export const ParagraphM = styled(StyledParagraph)`
    font-size:12px;
    line-height:16px;
`

export const ParagraphS = styled(StyledParagraph)`
    font-size:10px;
    line-height:16px;
    text-transform:uppercase;
`