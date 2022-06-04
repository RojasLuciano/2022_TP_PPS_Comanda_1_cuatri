import { ActivityIndicator } from 'react-native'
import React from 'react'
import { StyledView } from './Spinner.styled'
import LottieView from 'lottie-react-native';

const Spinner = () => {
  return (
    <StyledView>
      <LottieView
        autoPlay
        style={{
          width: 400,
          height: 400,
        }}
        source={require('../../../../assets/icon.json')}
      />
    </StyledView>
  )
}

export default Spinner