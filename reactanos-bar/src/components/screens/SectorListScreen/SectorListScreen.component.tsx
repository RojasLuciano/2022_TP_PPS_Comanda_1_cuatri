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
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat, sleep } from "../../../utils/utils";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { StyledView } from "./SectorListScreen.styled";
import { Client } from "../../../models/user/client.types";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { showMessage } from "react-native-flash-message";
import { RefreshControl } from "react-native";
import OrderDetails from "../../organisms/OrderDetails/OrderDetails.component";

//Esta pantalla es listar pedidos de cada sector

interface ProductData{
    name:string;
    description:string;
    elaborationTime:number;
    price:number;
    creationDate:number;
    orderId:string;
}



const SectorListScreen = ({ navigation }: any) => {
    const currentUser: AuthTypes = useSelector<IStore, any>((store) => store.auth);
    const [data, setData] = useState<ProductData[]>([]);
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
            //obtains products ordered by sector
            const querySnapshot = await getDocs(
                query(collection(db, "orders"), where("orderStatus", "==", "Pendiente"), orderBy("creationDate"))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), orderId: doc.id };
                let nameData = res.products.name;
                setData((arr: any[]) =>
                [...arr,{...res,name:nameData}].sort((a, b) =>
                    a.creationDate < b.creationDate
                        ? 1
                        : a.creationDate > b.creationDate
                        ? -1
                        : 0
                )
                );
            }
            );
            await sleep(1000);
        } catch (error) {
            console.log("SectorListScreen getDocuments ",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    // const handleAccept = async (orderId: string, userId: string) => {
    //     console.log("SectorListScreen: orderId", orderId," userId ",userId);
    //     try {
    //         dispatch(fetchLoadingStart());
    //         const orderCollection = collection(db, "orders");
    //         const orderRef = doc(orderCollection, orderId);
    //         await updateDoc(orderRef, { orderStatus: "Asignado" });
    //         const userCollection = collection(db, "users");
    //         const userRef = doc(userCollection, userId);
    //         await updateDoc(userRef, { restoStatus: "Pedido aceptado" });
    //         showMessage({
    //             type: "success",
    //             message: "Exito",
    //             description: "El pedido fue distribuído a las distintas áreas",
    //         });
    //         setData([]);
    //         await getDocuments();
    //     } catch (error: any) {
    //         console.log("SectorListScreen handleAccept ",error);
    //         errorHandler(error.code);
    //     } finally {
    //         dispatch(fetchLoadingFinish());
    //     }
    // };

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
                {data.map((item:{name:string;}) => (
                console.log("SectorListScreen: order", item),
                    <OrderDetails
                        client={`${item.name}`}
                        // onPress={() => handleAccept(order.orderId, order.id)}
                        onPress={() => console.log("SectorListScreen onPress")}
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default SectorListScreen;
