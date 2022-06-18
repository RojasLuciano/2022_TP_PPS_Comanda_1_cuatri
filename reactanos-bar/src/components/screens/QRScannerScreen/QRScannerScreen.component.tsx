import { StyleSheet } from 'react-native'
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
        style={StyleSheet.absoluteFillObject}
    />
  )
}

export default QRScannerScreen