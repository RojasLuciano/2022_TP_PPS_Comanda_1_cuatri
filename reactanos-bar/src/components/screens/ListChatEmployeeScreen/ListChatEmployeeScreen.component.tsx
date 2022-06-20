import React, { useEffect, useState } from 'react'
import {
    StyledLinearGradient,
    StyledView,
} from "./ListChatEmployeeScreen.styled";
import Button from '../../atoms/Button/Button.component';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from "../../../InitApp";
import { fetchLoadingFinish, fetchLoadingStart } from '../../../redux/loaderReducer';
import { useDispatch } from 'react-redux';
import { Screens } from '../../../navigation/Screens';

const ListChatEmployeeScreen = ({navigation}:any) => {
    const [data, setData] = useState<any>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getDocuments();
    }, []);

    const handleChat = (table: any) => {
        navigation.navigate(Screens.CHAT, {table});
    }

    const getDocuments = async () => {
        setData([]);
        try {
            dispatch(fetchLoadingStart());
            const querySnapshot = await (await getDocs(query(collection(db, "tables"), where('status','==','Ocupada') ,orderBy('tableNumber', 'desc'))));
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), id: doc.id };  
                setData((arr: any) => [...arr, { ...res, id: doc.id }].sort((a, b) => (a.tableNumber > b.tableNumber ? 1 : a.tableNumber < b.tableNumber ? -1 : 0)));
            });
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(fetchLoadingFinish());
        }
    }

    return (
        <StyledView>
            <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
                {data.map((item: any) => (
                    <Button key={item.id} onPress={() => handleChat(item.tableNumber)}>
                        {item.tableNumber}
                    </Button>
                ))}
            </StyledLinearGradient>
        </StyledView>
    )
}
export default ListChatEmployeeScreen