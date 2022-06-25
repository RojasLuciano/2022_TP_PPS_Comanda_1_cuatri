import React, { useCallback, useState } from "react";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../../InitApp";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { currencyFormat, sleep } from "../../../utils/utils";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { StyledView } from "./WaitingOrderListScreen.styled";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { showMessage } from "react-native-flash-message";
import { RefreshControl } from "react-native";
import OrderDetails from "../../organisms/OrderDetails/OrderDetails.component";
import { sendPushNotification } from "../../../utils/pushNotifications";
import { successHandler } from "../../../utils/SuccessHandler";

//Esta pantalla es listar pedidos.

const WaitingOrderListScreen = ({ navigation }: any) => {
    const [data, setData] = useState<any[]>([]);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            getDocuments();
        }, [])
    );

    const getDocuments = async () => {
        dispatch(fetchLoadingStart());
        setData([]);
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "orders"), where('orderStatus', '==', 'Pendiente'), orderBy("creationDate"))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), orderId: doc.id };
                setData((arr: any[]) =>
                    [...arr, { ...res }].sort((a, b) =>
                        a.creationDate < b.creationDate
                            ? 1
                            : a.creationDate > b.creationDate
                            ? -1
                            : 0
                    )
                );
            });
            await sleep(1000);
        } catch (error) {
            console.log("WaitingOrderListScreen getDocuments ",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const handleAccept = async (orderId: string, userId: string) => {
        console.log("WaitingOrderListScreen: orderId", orderId," userId ",userId);
        try {
            dispatch(fetchLoadingStart());
            const orderCollection = collection(db, "orders");
            const orderRef = doc(orderCollection, orderId);
            await updateDoc(orderRef, { orderStatus: "Asignado" });
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, userId);
            await updateDoc(userRef, { restoStatus: "Pedido aceptado" });
            await sendPushNotification({title:"Nuevo pedido", description:"Tenés un nuevo pedido para realizar", profile:["waiter", "cook"]})
            await sleep(1000);
            successHandler('order-sector-delivered')
            setData([]);
            await getDocuments();
        } catch (error: any) {
            console.log("WaitingOrderListScreen handleAccept ",error);
            errorHandler(error.code);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const formatAmount = (price: any) => {
        const total = parseFloat(price.toString().replace(/,/g, "."));
        return total !== 0
            ? currencyFormat(total.toFixed(2).toString())
            : total;
    };

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView
                style={{ width: "100%" }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={getDocuments}
                    />
                }
            >
                {data.map((order, index) => (
                    <OrderDetails
                        key={index}
                        index={order.orderId}
                        client={`${order.name} ${order.lastName}`}
                        products={order.products}
                        total={formatAmount(order.totalAmount)}
                        onPress={() => handleAccept(order.orderId, order.id)}
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default WaitingOrderListScreen;
