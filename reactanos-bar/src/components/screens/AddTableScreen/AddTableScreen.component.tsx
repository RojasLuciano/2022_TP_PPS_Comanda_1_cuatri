import React, { useCallback, useState } from "react";
import { StyledLinearGradient } from "./AddTableScreen.styled";
import { useForm } from "react-hook-form";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { db } from "../../../InitApp";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import AddTableController from "../../organisms/AddTableController/AddTableController.component";
import {
    fetchLoadingStart,
    fetchLoadingFinish,
} from "../../../redux/loaderReducer";
import { useFocusEffect } from "@react-navigation/native";
import { validateInputs } from "../../../utils/utils";
import { successHandler } from "../../../utils/SuccessHandler";
import { Screens } from "../../../navigation/Screens";

interface TableData {
    tableNumber: number;
    clientsQuantity: number;

}

const AddTableScreen = ({ navigation }: any) => {
    const { control, getValues, reset } = useForm<TableData>();
    const data: AuthTypes = useSelector<IStore, any>((store) => store.auth);
    const [tableType, setTableType] = useState("");
    const[statusTable, setStatus] = useState("Desocupada");
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            clear();
        }, [])
    );

    const registerTable = async () => {
        try {
            dispatch(fetchLoadingStart());
            const values = getValues();
            validateInputs(values);
            const collectionRef = collection(db, "tables");
            const docRef = doc(collectionRef, values.tableNumber.toString());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                throw { code: "table-exists" };
            }
            await setDoc(doc(collectionRef, values.tableNumber.toString()), {
                type: tableType,
                status: statusTable,
                creationDate: new Date(),
                ...values,
            });
            successHandler("table-created");
            navigation.navigate(Screens.QRCode, {
                title: "Mesa creada exitosamente",
                subtitle:
                    "La mesa ya está cargado en nuestras bases de datos, de todas formas asegurate de guardar el código QR que te brindamos",
                code: JSON.stringify({tableCode:values.tableNumber.toString()}),
            });
            clear();
        } catch (e: any) {
            console.log("AddTableScreen registerTable ",e);
            errorHandler(e.code);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const clear = () => {
        reset();
        setTableType("");
    };

    return (
        <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
            <AddTableController
                onPress={registerTable}
                control={control}
                onChangeType={setTableType}
            />
        </StyledLinearGradient>
    );
};

export default AddTableScreen;
