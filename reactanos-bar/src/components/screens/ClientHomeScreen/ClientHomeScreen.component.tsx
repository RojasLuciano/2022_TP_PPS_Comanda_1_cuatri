import React, { useCallback, useEffect } from "react";
import { StyledView, MarginVertical } from "./ClientHomeScreen.styled";
import CardButton from "../../molecules/CardButton/CardButton.component";
import Paragraph from "../../atoms/Heading/Heading.component";
import Heading from "../../atoms/Heading/Heading.component";
import { Screens } from "../../../navigation/Screens";
import { IStore } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypes, refreshUserData } from "../../../redux/authReducer";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../InitApp";
import { showMessage } from "react-native-flash-message";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { RefreshControl, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const ClientHomeScreen = ({ navigation }: any) => {
    const data: AuthTypes = useSelector<IStore, any>((store) => store.auth);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
      );

    const onRefresh = () => {
        dispatch(refreshUserData());
    };

    const signToRestaurant = async (code: any) => {
        try {
            dispatch(fetchLoadingStart());
            const collectionRef = collection(db, "QRs");
            const docRef = doc(collectionRef, code);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw { code: "invalid-qr" };
            }
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, data.user.id);
            await updateDoc(userRef, { restoStatus: "Pendiente", modifiedDate: new Date() });
            showMessage({
                type: "success",
                message: "Exito",
                description: "Ahora estás pendiente de ingresar al local",
            });
            dispatch(refreshUserData());
        } catch (error: any) {
            console.log(error)
            errorHandler(error.code);
            dispatch(fetchLoadingFinish());
        }
    };

    const sitOnTable = async (code:string) => {
        try {
            dispatch(fetchLoadingStart());
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef, code);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw { code: "table-not-exists" };
            }
            if(code !== data.user.table){
                throw { code: "table-doesnt-match" };
            }
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, data.user.id);
            await updateDoc(userRef, { restoStatus: "Sentado", modifiedDate: new Date() });
            showMessage({
                type: "success",
                message: "Exito",
                description: "Te acabas de sentar en la mesa, ya podés hacer tu pedido",
            });
            dispatch(refreshUserData());
        } catch (error: any) {
            console.log(error)
            errorHandler(error.code);
            dispatch(fetchLoadingFinish());
        }
    }

    const handleSignToRestaurant = () => {
        navigation.navigate(Screens.QR_SCANNER, {
            screen: Screens.QR_BUTTON,
            params: { goBack:signToRestaurant, description:"Escaneá el código QR para solicitar acceso a nuestro local" },
        });
    };

    const handleSitOnTable = () => {
        navigation.navigate(Screens.QR_SCANNER, {
            screen: Screens.QR_BUTTON,
            params: { goBack:sitOnTable, description:"Escaneá el código QR de la mesa que te fue asignada" },
        });
    };

    const goToOrder = () => {
        navigation.navigate(Screens.ADD_ORDER);
    };

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
                <Heading bold level="L" color="white">
                    ¡Bienvenido a nuestro local!
                </Heading>
                <MarginVertical>
                    <Paragraph level="M" color="white">
                        Esperamos que nuestro servicio cumpla con sus
                        expectativas
                    </Paragraph>
                </MarginVertical>
                <MarginVertical>
                    <Paragraph level="M" color="white">
                        Estamos a su disposición ante cualquier consulta
                    </Paragraph>
                </MarginVertical>
                <MarginVertical>
                    <CardButton>Ver encuestas antigüas</CardButton>
                </MarginVertical>
                <MarginVertical>
                    {!data.user.restoStatus && (
                        <CardButton onPress={handleSignToRestaurant}>
                            Ingresar al local
                        </CardButton>
                    )}
                    {data.user.restoStatus === "Pendiente" && (
                        <CardButton disabled>
                            Estás pendiente para ingresar
                        </CardButton>
                    )}
                    {data.user.restoStatus === "Asignado" && (
                        <CardButton onPress={handleSitOnTable}>
                            Sentarse en la mesa
                        </CardButton>
                    )}
                    {data.user.restoStatus === "Sentado" && (
                        <CardButton onPress={goToOrder}>
                            Realizar pedido
                        </CardButton>
                    )}
                </MarginVertical>
            </ScrollView>
        </StyledView>
    );
};

export default ClientHomeScreen;
