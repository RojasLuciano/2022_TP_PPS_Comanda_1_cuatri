import React, { useCallback, useEffect, useState } from "react";
import {
    addDoc,
    arrayUnion,
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
import { StyledView } from "./CompleteOrderSecondScreen.styled";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { showMessage } from "react-native-flash-message";
import { RefreshControl } from "react-native";
import OrderDetails from "../../organisms/OrderDetails/OrderDetails.component";
import { Screens } from "../../../navigation/Screens";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { sendPushNotification } from "../../../utils/pushNotifications";
import { successHandler } from "../../../utils/SuccessHandler";

const CompleteOrderSecondScreen = ({ navigation, route }: any) => {
    const [data, setData] = useState<any[]>([]);
    const dispatch = useDispatch();
    const [products, setProducts] = useState<any>([])
    const userData: AuthTypes = useSelector<IStore, any>(store => store.auth);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        const { order } = route.params;
        setOrderId(order.orderId);
        let productsBuffer: any = [];
        order.products.forEach((product: any) => {
            if (product.sector.replace(/["']/g, "") === userData.user.profile && product.status === "Pendiente") {
                productsBuffer.push(product);
            }
        })
        setProducts(productsBuffer);
    }, [])

    const formatAmount = (price: any) => {
        const total = parseFloat(price.toString().replace(/,/g, "."));
        return total !== 0
            ? currencyFormat(total.toFixed(2).toString())
            : total;
    };

    const makeAnOrder = async (productParam:string) => {
        dispatch(fetchLoadingStart());
        try 
        {
        const userCollection = collection(db, "orders");
        const userRef = doc(userCollection, orderId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const products = userData?.products;
        products.map((product: any) => {
            if (product.id === productParam) {
                product.status = "Entregado";
            }
        }
        )   
        const update = await updateDoc(userRef, { products });
        await sendPushNotification({title:"Pedido", description:"Tenés un pedido que puede estar listo para entregar", profile:"waiter"})
        await sleep(1000);
        successHandler('product-delivered')
        navigation.goBack();
        }
        catch (error:any) {
            console.log("CompleteOrderSecondScreen makeAnOrder ", error);
        }
        finally {
            dispatch(fetchLoadingFinish());
        }
    }

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView
                style={{ width: "100%" }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                    />
                }
            >
                 {products.map((product: any, index: number) => (
                    <OrderDetails
                        key={index}
                        title={`${product.name}`}
                        description={product.description}
                        client={`Elaboración: ${product.elaborationTime} min`}
                        onPress={() => {
                            makeAnOrder(product.id)
                        }}
                        onPressText="Realizar pedido."
                    />
                ))} 
            </ScrollView>
        </StyledView>
    );
};

export default CompleteOrderSecondScreen;
