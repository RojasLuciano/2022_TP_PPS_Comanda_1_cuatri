import React, { FC } from 'react'
import { StyledRow, StyledView, StyledEnd } from './ProductCard.styled';
import Carousel from '../../molecules/Carousel/Carousel.component';
import Heading from '../../atoms/Heading/Heading.component';
import Paragraph from '../../atoms/Paragraph/Paragraph.component';
import { currencyFormat } from '../../../utils/utils';
import { Text, TouchableOpacity } from 'react-native';
import AwesomeButton from '../../atoms/AwesomeButton/Button.component';
import { View } from 'native-base';
import Divider from '../../atoms/Divider/Divider.component';

interface ProductCardProps{
  images:string[]
  name:string;
  description:string;
  price:string;
  elaborationTime:string;
  onPress:(add:boolean)=>void
  quantity:number;
}

const ProductCard:FC<ProductCardProps> = ({images,name,description,price,quantity=0, onPress}) => {
  return (
    <StyledView>
      <Carousel images={images} />
      <StyledRow>
        <Heading>{name}</Heading>
        <Heading>{currencyFormat(price)}</Heading>
      </StyledRow>
      <StyledRow>
        <Paragraph textAlign='left'>{description}</Paragraph>
      </StyledRow>
      <Divider />
      <StyledEnd>
          <AwesomeButton style={{marginRight:10}} onPress={()=>onPress(false)} rounded>
            -
          </AwesomeButton>
          <Heading level='XL'>{quantity}</Heading>
          <AwesomeButton style={{marginLeft:10}} onPress={()=>onPress(true)} rounded>
            +
          </AwesomeButton>
      </StyledEnd>
    </StyledView>
  )
}

export default ProductCard