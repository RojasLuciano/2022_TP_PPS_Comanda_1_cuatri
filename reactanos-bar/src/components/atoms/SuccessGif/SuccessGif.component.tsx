import { View, Text, Image, PixelRatio } from 'react-native'
import React from 'react'

const SuccessGif = () => {;
  return (
      <Image source={require('../../../../assets/success.gif')} style={{height:100, width:100, backgroundColor:'transparent'}} />
  )
}

export default SuccessGif