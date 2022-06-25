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
import { db, storage } from "../../../InitApp";
import { useFocusEffect } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat, sleep } from "../../../utils/utils";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { StyledView } from "./CollectTableMoneyScreen.styled";
import UserCard from "../../molecules/UserCard/UserCard.component";
import { errorHandler } from '../../../utils/ErrorsHandler';
import { showMessage } from 'react-native-flash-message';
import { RefreshControl } from "react-native";
import { sendPushNotification } from "../../../utils/pushNotifications";
import { ConfigurationTypes } from "../../../redux/configurationReducer";
import { IStore } from "../../../redux/store";

const CollectMoneyScreen = ({navigation}:any) => {
    const [data, setData] = useState<any[]>([]);
    const dispatch = useDispatch();
    const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);

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
                query(collection(db, "orders"), where("orderStatus","==", "Pagado"), orderBy("modifiedDate"))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), orderId: doc.id };
                const imageUrl = await getDownloadURL(ref(storage, res.image));
                setData((arr: any[]) =>
                    [...arr, { ...res, image: imageUrl }].sort(
                    )
                );
            });
            await sleep(1000);
        } catch (error) {
            console.log("CollectMoneyScreen getDocuments ",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const handleCollect = async (orderId:any, tableId:any, userId:any) => {
        try {
            dispatch(fetchLoadingStart())
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef,tableId);
            await updateDoc(docRef, {status:"Desocupada"});
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, userId);
            await updateDoc(userRef, {table: null, restoStatus:null, discount:null, pollfilled:null})
            const orderCollection = collection(db, "orders");
            const orderRef = doc(orderCollection, orderId);
            await updateDoc(orderRef, {orderStatus:"Cobrado"});
            await sendPushNotification({title:"Cuenta cobrada", description:"¡Gracias por visitarnos!", profile:"cliente"})
            showMessage({type:'success', message:'Exito', description:'Cuenta cobrada exitosamente'})
            setData([]);
            await getDocuments();
        } catch (error:any) {
            console.log("CollectMoneyScreen handleAccept ",error);
            errorHandler(error.code, configuration.vibration);
        } finally{
            dispatch(fetchLoadingFinish())
        }
    }

    const formatAmount = (price: any) => {
        const total = parseFloat(price.toString().replace(/,/g, "."));
        return currencyFormat(total.toString())
    };

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView style={{ width: "100%" }} refreshControl={
                    <RefreshControl refreshing={false} onRefresh={getDocuments} />
                }>
                {data.map((item) => (
                    <UserCard
                        key={item.id}
                        name={item.name}
                        lastName={item.lastName}
                        image={item.image}
                        table={item.table}
                        total={formatAmount(item.totalAmount)}
                        onPress={() => handleCollect(item.orderId, item.table, item.id)}
                        user="Cliente"
                        state="Pendiente"
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default CollectMoneyScreen;
