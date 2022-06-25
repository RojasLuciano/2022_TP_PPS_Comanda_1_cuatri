import React, { useCallback, useState } from "react";
import {
    collection,
    doc,
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
import { StyledView } from "./ClientListScreen.styled";
import UserCard from "../../molecules/UserCard/UserCard.component";
import { Client } from "../../../models/user/client.types";
import emailjs  from '@emailjs/browser';

const ClientListScreen = () => {
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
                query(collection(db, "users"), where("profile","==","cliente"), where("status", "==", "Pendiente"), orderBy("creationDate"))
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

    const handleEmail = (email:string ) => {
        emailjs.send("service_10cobij","template_rxzzjck",{ // template_rxzzjck se pueden armar distintos templates desde la web https://dashboard.emailjs.com/admin/templates
            from_name: "ReactanosBar", // sender name
            to_email: email, // receiver
            }
            ,'ckH9NEh-8v8u37NFr'
            );
    }

    const handleAccept = async (id:string, email:string, statusChange:string) => {
        dispatch(fetchLoadingStart())
        try {
            const ref = doc(db, "users", id);
            await updateDoc(ref, {status:statusChange})
            if(statusChange === "Activo"){
                // handleEmail(email);
            }
            getDocuments();
        } catch (error) {
            console.log(error)
        } finally{
            dispatch(fetchLoadingFinish())
        }
    }

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView style={{ width: "100%" }}>
                {data.map((item) => (
                    <UserCard
                        key={item.id}
                        name={item.name}
                        lastName={item.lastName}
                        image={item.image}
                        dni={item.dni}
                        email={item.email}
                        onPressActive={() => handleAccept(item.id, item.email,"Activo")}
                        onPressCancel={() => handleAccept(item.id, item.email,"Cancelado")}
                        user="Cliente"
                        state="Pendiente"
                    />
                ))}
            </ScrollView>
        </StyledView>
    );
};

export default ClientListScreen;
