import React, { FC } from 'react'
import {SliderBox} from 'react-native-image-slider-box';
import { StyledView } from './Carousel.styled';

interface CarouselProps{
    images:string[]
}

const Carousel:FC<CarouselProps> = ({images}) => {
  return (
    <StyledView>
        <SliderBox images={images}  sliderBoxHeight={300} parentWidth={200} />
    </StyledView>
  )
}

export default Carousel