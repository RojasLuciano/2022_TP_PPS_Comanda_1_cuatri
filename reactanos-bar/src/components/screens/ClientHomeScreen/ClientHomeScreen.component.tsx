import React, { useCallback, useEffect, useState } from "react";
import { StyledView, MarginVertical } from "./ClientHomeScreen.styled";
import CardButton from "../../molecules/CardButton/CardButton.component";
import Paragraph from "../../atoms/Heading/Heading.component";
import Heading from "../../atoms/Heading/Heading.component";
import { Screens } from "../../../navigation/Screens";
import { IStore } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
    AuthTypes,
    handleLogout,
    refreshUserData,
} from "../../../redux/authReducer";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../../InitApp";
import { showMessage } from "react-native-flash-message";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { RefreshControl, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { sleep } from "../../../utils/utils";
import { sendPushNotification } from "../../../utils/pushNotifications";
import { successHandler } from "../../../utils/SuccessHandler";
import Modal from "../../atoms/Modal/Modal.component";
import { ConfigurationTypes } from "../../../redux/configurationReducer";

const ClientHomeScreen = ({ navigation }: any) => {
    const data: AuthTypes = useSelector<IStore, any>((store) => store.auth);
    const dispatch = useDispatch();
    const [tableButtons, setTableButtons] = useState(false);
    const [orderStatus, setOrderStatus] = useState("");
    const [orderId, setOrderId] = useState("");
    const configuration: ConfigurationTypes = useSelector<IStore, any>(
        (store) => store.configuration
    );

    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [])
    );

    const onRefresh = () => {
        handleOrderStatus();
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
            await updateDoc(userRef, {
                restoStatus: "Pendiente",
                modifiedDate: new Date(),
            });
            await sendPushNotification({
                title: "Lista de espera",
                description: "Hay un cliente nuevo en la lista de espera",
                profile: "meter",
            });
            await sleep(1000);
            successHandler("waiting-list");
            dispatch(refreshUserData());
        } catch (error: any) {
            console.log("ClientHomeScreen signToRestaurant", error);
            errorHandler(error.code, configuration.vibration);
            dispatch(fetchLoadingFinish());
        }
    };

    const sitOnTable = async (code: string) => {
        try {
            dispatch(fetchLoadingStart());
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef, code);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw { code: "table-not-exists" };
            }
            if (code !== data.user.table) {
                throw { code: "table-doesnt-match" };
            }
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, data.user.id);
            await updateDoc(userRef, {
                restoStatus: "Sentado",
                modifiedDate: new Date(),
            });
            successHandler("sit-on-table");
            dispatch(refreshUserData());
        } catch (error: any) {
            console.log("ClientHomeScreen sitOnTable", error);
            errorHandler(error.code, configuration.vibration);
            dispatch(fetchLoadingFinish());
        }
    };

    const handleSignToRestaurant = () => {
        navigation.navigate(Screens.QR_SCANNER, {
            screen: Screens.QR_BUTTON,
            params: {
                goBack: signToRestaurant,
                description:
                    "Escaneá el código QR para solicitar acceso a nuestro local",
            },
        });
    };

    const handleSitOnTable = () => {
        console.log("ClientHomeScreen handleSitOnTable");
        navigation.navigate(Screens.QR_SCANNER, {
            screen: Screens.QR_BUTTON,
            params: {
                goBack: sitOnTable,
                description:
                    "Escaneá el código QR de la mesa que te fue asignada",
            },
        });
    };

    const goToOrder = () => {
        console.log("ClientHomeScreen goToOrder");
        navigation.navigate(Screens.ADD_ORDER);
    };

    const goBackQr = async (code: any) => {
        try {
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef, code);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw { code: "table-not-exists" };
            }
            if (code != data.user.table) {
                throw { code: "table-doesnt-match" };
            }
            await handleOrderStatus();
            setTableButtons(true);
        } catch (error: any) {
            console.log("ClientHomeScreen goBackQr ", error);
            errorHandler(error.code, configuration.vibration);
            dispatch(fetchLoadingFinish());
        }
    };

    const goBackFinish = async (code: any) => {
        try {
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef, code);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw { code: "table-not-exists" };
            }
            if (code !== data.user.table) {
                throw { code: "table-doesnt-match" };
            }
            navigation.navigate(Screens.FINISH_TABLE, {
                screen: Screens.FINISH_TABLE,
            });
        } catch (error: any) {
            console.log("ClientHomeScreen goBackQr ", error);
            errorHandler(error.code, configuration.vibration);
            dispatch(fetchLoadingFinish());
        }
    };

    const finishOrder = async () => {
        dispatch(fetchLoadingStart());
        try {
            setOrderStatus("");
            const orderCollection = collection(db, "orders");
            const orderRef = doc(orderCollection, orderId);
            await updateDoc(orderRef, { orderStatus: "Terminado" });
            await sleep(1000);
            onRefresh();
        } catch (error) {
            errorHandler("", configuration.vibration);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const goToQr = () => {
        navigation.navigate(Screens.QR_SCANNER, {
            screen: Screens.QR_BUTTON,
            params: {
                goBack: goBackQr,
                description:
                    "Escaneá el código QR de la mesa que te fue asignada para acceder al estado de la mesa, los juegos y la encuesta",
            },
        });
    };

    const goToFinishTable = () => {
        navigation.navigate(Screens.QR_SCANNER, {
            screen: Screens.QR_BUTTON,
            params: {
                goBack: goBackFinish,
                description:
                    "Escaneá el código QR de la mesa que te fue asignada para poder visualizar la cuenta",
            },
        });
    };

    const goToOlderPolls = () => {
        navigation.navigate(Screens.GRAPHIC_SCREEN, {});
    };

    const goToPoll = () => {
        navigation.navigate(Screens.ADD_POLL, {});
    };

    const goToGames = () => {
        navigation.navigate(Screens.GUESS_THE_NUMBER, {});
    };

    const handleOrderStatus = async () => {
        dispatch(fetchLoadingStart());
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(db, "orders"),
                    where("email", "==", data.user.email),
                    where("orderStatus", "!=", "Terminado")
                )
            );
            querySnapshot.forEach((doc) => {
                const res: any = { ...doc.data() };
                setOrderStatus(res.orderStatus);
                setOrderId(doc.id);
                if (res.orderStatus === "Cobrado") {
                    setTableButtons(false);
                }
            });
            await sleep(1000);
        } catch (error: any) {
            console.log("ClientHomeScreen getOrderStatus ", error);
            errorHandler(error.code, configuration.vibration);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const getOrderStatus = async () => {
        showMessage({
            duration: 3000,
            type: "success",
            message: "Exito",
            description: `El estado de tu pedido es: ${orderStatus}`,
        });
    };

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
                <Modal
                    isVisible={orderStatus === "Cobrado"}
                    title="¡Gracias por visitarnos!"
                    onPrimary={finishOrder}
                    subtitle="Esperamos que nuestros servicios hayan sido de tu agrado"
                    onPrimaryText="Cerrar sesión"
                ></Modal>
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
                    <CardButton onPress={goToOlderPolls}>
                        Ver encuestas antigüas
                    </CardButton>
                </MarginVertical>
                {orderStatus === "Pagado" && (
                    <MarginVertical>
                        <CardButton disabled>
                            Esperá a que confirmen el pago
                        </CardButton>
                    </MarginVertical>
                )}
                {!tableButtons && (
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
                )}
                {!tableButtons &&
                    (orderStatus === "Pendiente" ||
                        data.user.restoStatus === "Pedido terminado" ||
                        data.user.restoStatus === "Pedido aceptado") && (
                        <CardButton onPress={goToQr}>
                            Escanear QR de la mesa
                        </CardButton>
                    )}
                {tableButtons && (
                    <>
                        {orderStatus !== "Pagado" && orderStatus !== "Cobrado" && (
                            <>
                                {!data.user.pollfilled &&
                                    orderStatus == "Pedido terminado" && (
                                        <MarginVertical>
                                            <CardButton onPress={goToPoll}>
                                                Realizar encuesta
                                            </CardButton>
                                        </MarginVertical>
                                    )}
                                {!data.user.discount && (
                                <MarginVertical>
                                    <CardButton onPress={goToGames}>
                                            Ir a los juegos
                                        </CardButton>
                                </MarginVertical>
                                )}
                                <MarginVertical>
                                    <CardButton
                                        onPress={() =>
                                            navigation.navigate(Screens.CHAT)
                                        }
                                    >
                                        Hacer una consulta
                                    </CardButton>
                                </MarginVertical>
                            </>
                        )}
                        {orderStatus === "Pedido terminado" ? (
                            <MarginVertical>
                                <CardButton onPress={goToFinishTable}>
                                    Pedir la cuenta
                                </CardButton>
                            </MarginVertical>
                        ) : (
                            <MarginVertical>
                                <CardButton onPress={getOrderStatus}>
                                    Estado del pedido
                                </CardButton>
                            </MarginVertical>
                        )}
                    </>
                )}
            </ScrollView>
        </StyledView>
    );
};

export default ClientHomeScreen;
