import { View } from 'react-native'
import React, { useState } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'

const QRScannerScreen = ({route, navigation}:any) => {
  const [scanned, setScanned] = useState(false);

  const handleScanQR = ({data}:any) => {
    const tableCode = data.replace(/[^0-9]/g, "");
    console.log("QRScannerScreen handleScanQR ",tableCode);
    setScanned(true);
    route.params.goBack(tableCode)
    navigation.goBack();
  }

  return (
    <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScanQR}
    style={{        
      flex: 1,
      backgroundColor: 'black',                
      alignItems: 'center',
      justifyContent: 'center',  }}
  >
    <View style={{
      width: 200,
      height: 200,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 30
    }}></View>
  </BarCodeScanner>
  )
}

export default QRScannerScreen