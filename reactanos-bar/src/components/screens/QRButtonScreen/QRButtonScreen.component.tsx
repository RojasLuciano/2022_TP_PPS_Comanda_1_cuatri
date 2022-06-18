import React, { useState } from "react";
import { StyledView } from "./QRButtonScreen.styled";
import ImageButton from "../../atoms/ImageButton/ImageButton.component";
import Heading from "../../atoms/Heading/Heading.component";
import Paragraph from "../../atoms/Paragraph/Paragraph.component";
import { Screens } from "../../../navigation/Screens";

const QRButtonScreen = ({ navigation, route }: any) => {
    const { params } = route;

    const goBack = (data: any) => {
        params.goBack(data);
        navigation.goBack();
    };

    const handlePressQR = () => {
        console.log("QRButtonScreen handlePressQR");
        navigation.navigate(Screens.QR_SCANNER, { goBack });
    };

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <Heading bold level="L" color="white">
                Escanea el código QR
            </Heading>
            <Paragraph level="L" color="white">
                {params?.description ||
                    "Al escanear el código QR correspondiente vas a poder acceder al servicio solicitado"}
            </Paragraph>
            <ImageButton
                source={require("../../../../assets/read-qr.png")}
                onPress={handlePressQR}
            />
        </StyledView>
    );
};

export default QRButtonScreen;
