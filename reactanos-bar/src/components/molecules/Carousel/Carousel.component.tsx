import React, { FC } from 'react'
import {SliderBox} from 'react-native-image-slider-box';
import { StyledView } from './Carousel.styled';

interface CarouselProps{
    images:string[]
}

const Carousel:FC<CarouselProps> = ({images}) => {
  return (
    <StyledView>
        <SliderBox images={images} sliderBoxHeight={250} parentWidth={250} />
    </StyledView>
  )
}

export default Carousel