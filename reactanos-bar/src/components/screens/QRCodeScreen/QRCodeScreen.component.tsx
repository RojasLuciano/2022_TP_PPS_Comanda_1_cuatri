import React, { FC } from 'react'
import QRCode from "react-qr-code";
import { StyledQR, StyledTextContainer, StyledView } from './QRCodeScreen.styled';
import Heading from '../../atoms/Heading/Heading.component';
import Paragraph from '../../atoms/Paragraph/Paragraph.component';
import SuccessGif from '../../atoms/SuccessGif/SuccessGif.component';
import { normalize } from '../../../utils/utils';

const QRCodeScreen = ({route}:any) => {
  const {params} = route;
  return (
    <StyledView colors={["#6190E8", "#A7BFE8"]}>
        <StyledTextContainer>
            <SuccessGif />
            <Heading bold level='L' color='white'>{params.title}</Heading>
            <Paragraph level='L' color='white'>{params.subtitle}</Paragraph>
        </StyledTextContainer>
        <StyledQR>
          <QRCode size={normalize(200)} value={params.code} />
        </StyledQR>
    </StyledView>
  )
}

export default QRCodeScreen