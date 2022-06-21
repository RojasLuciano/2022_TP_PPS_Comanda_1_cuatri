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
import { StyledView } from "./CompleteOrderFirstScreen.styled";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { showMessage } from "react-native-flash-message";
import { RefreshControl } from "react-native";
import OrderDetails from "../../organisms/OrderDetails/OrderDetails.component";
import { Screens } from "../../../navigation/Screens";

const CompleteOrderFirstScreen = ({ navigation }: any) => {
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
            console.log("CompleteOrderFirstScreen getDocuments ",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const goToOrder = async (order:any) => {
        navigation.navigate(Screens.PENDING_ORDER,{order});
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
                        title={`Mesa ${order.table}`}
                        client={`${order.name} ${order.lastName}`}
                        products={order.products}
                        onPress={() => goToOrder(order)}
                        onPressText="Ver pedido"
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default CompleteOrderFirstScreen;
