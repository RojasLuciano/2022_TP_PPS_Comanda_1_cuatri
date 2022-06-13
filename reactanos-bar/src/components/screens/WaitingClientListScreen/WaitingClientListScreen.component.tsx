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
import { useDispatch } from "react-redux";
import { sleep } from "../../../utils/utils";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { StyledView } from "./WaitingClientListScreen.styled";
import UserCard from "../../molecules/UserCard/UserCard.component";
import { Client } from "../../../models/user/client.types";
import { Screens } from "../../../navigation/Screens";
import { errorHandler } from '../../../utils/ErrorsHandler';
import { showMessage } from 'react-native-flash-message';
import { RefreshControl } from "react-native";

const WaitingClientListScreen = ({navigation}:any) => {
    const [data, setData] = useState<Client[]>([]);
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
                query(collection(db, "users"), where("profile","in",["cliente", "invitado"]), where("restoStatus", "==", "Pendiente"), orderBy("modifiedDate"))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), id: doc.id };
                const imageUrl = await getDownloadURL(ref(storage, res.image));
                setData((arr: Client[]) =>
                    [...arr, { ...res, id: doc.id, image: imageUrl }].sort(
                        (a, b) =>
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
            console.log(error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const handleAccept = async (value:string, id:string) => {
        try {
            dispatch(fetchLoadingStart())
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef, value);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw { code: "table-not-exists" };
            }
            const tableData:any = docSnap.data();
            if (tableData.status !== "Desocupada") {
                throw { code: "table-taken" };
            }
            await updateDoc(docRef, {status:"Ocupada"})
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, id);
            await updateDoc(userRef, {table:value, restoStatus:"Asignado"})
            showMessage({type:'success', message:'Exito', description:'Cliente asignado exitosamente'})
            setData([]);
            await getDocuments();
        } catch (error:any) {
            errorHandler(error.code)            
        } finally{
            dispatch(fetchLoadingFinish())
        }
    }

    const goToScanner = async (id:string) => {
        navigation.navigate(Screens.QR_SCANNER, {goBack:(value:string) => handleAccept(value,id)})
    }

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
                        dni={item.dni}
                        email={item.email}
                        onPress={() => goToScanner(item.id)}
                        user="Cliente"
                        state="Pendiente"
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default WaitingClientListScreen;
