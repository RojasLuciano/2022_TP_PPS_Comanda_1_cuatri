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
import { StyledView } from "./DeliverOrderTableListScreen.styled";
import { Client } from "../../../models/user/client.types";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { showMessage } from "react-native-flash-message";
import { RefreshControl } from "react-native";
import OrderDetails from "../../organisms/OrderDetails/OrderDetails.component";

//Esta pantalla es listar pedidos.

const DeliverOrderTableListScreen = ({ navigation }: any) => {
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
                query(collection(db, "orders"), where('orderStatus', '==', 'Asignado'), orderBy("creationDate"))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), orderId: doc.id };
                setData((arr: any[]) =>
                    [...arr, { ...res }]
                );
            });
            await sleep(1000);
        } catch (error) {
            console.log("DeliverOrderTableListScreen getDocuments ",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const handleAccept = async (order: any) => {
        try {
            order.products.forEach((product:any) => {
                if(product.status !== "Entregado"){
                    throw ({code: 'order-not-ready'})
                }
            })
            dispatch(fetchLoadingStart());
            const orderCollection = collection(db, "orders");
            const orderRef = doc(orderCollection, order.orderId);
            await updateDoc(orderRef, { orderStatus: "Pedido terminado" });
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, order.id);
            await updateDoc(userRef, { restoStatus: "Pedido terminado" });
            showMessage({
                type: "success",
                message: "Exito",
                description: "El pedido fue servido en la mesa",
            });
            setData([]);
            await getDocuments();
        } catch (error: any) {
            console.log("DeliverOrderTableListScreen handleAccept ",error);
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
                        showStatus
                        onPress={() => handleAccept(order)}
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default DeliverOrderTableListScreen;
