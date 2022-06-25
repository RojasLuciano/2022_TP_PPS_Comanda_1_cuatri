import { View, Text, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    StyledCard,
    StyledRow,
    StyledView,
} from "./FinishTableScreen.styled";
import Heading from "../../atoms/Heading/Heading.component";
import Button from "../../atoms/Button/Button.component";
import ProductCard from "../../organisms/ProductCard/ProductCard.component";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { sleep, currencyFormat } from '../../../utils/utils';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../InitApp";
import { useFocusEffect } from "@react-navigation/native";
import Divider from "../../atoms/Divider/Divider.component";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { errorHandler } from '../../../utils/ErrorsHandler';
import { successHandler } from '../../../utils/SuccessHandler';
import OrderDetails from "../../organisms/OrderDetails/OrderDetails.component";
import ControlledCurrency from "../../molecules/ControlledCurrency/ControlledCurrency.component";
import { useForm } from "react-hook-form";
import MaskInput, { createNumberMask } from "react-native-mask-input";
import { Input } from "native-base";
import { ConfigurationTypes } from "../../../redux/configurationReducer";

const FinishTableScreen = ({navigation}:any) => {
    const dispatch = useDispatch();
    const [data, setData] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);
    const userData:AuthTypes = useSelector<IStore, any>(store=>store.auth);
    const [orderStatusPending, setOrderStatus] = useState("Pendiente");
    const { control, getValues} = useForm<any>();
    const [tip, setTip] = useState("");
    const [total, setTotal] = useState("");
    const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);

    useFocusEffect(
        useCallback(() => {
            getDocuments();
        }, [])
    );

    const mask = createNumberMask({
        prefix: ['$', ' '],
        delimiter: '.',
        separator: ',',
        precision: 0,
      })

    const getDocuments = async () => {
        dispatch(fetchLoadingStart());
        setData([]);
        setProducts([]);
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "orders"), where('email', '==', userData.user.email), where('orderStatus', '==', 'Pedido terminado'))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), id: doc.id };
                await sleep(2000);
                setData(res);
            });
            await sleep(2000);
        } catch (error) {
            console.log("FinishTableScreen getDocuments",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    useEffect(()=>{
        formatAmount();
    },[data])

    const registerOrder = async () => {
        try {
            dispatch(fetchLoadingStart())
            const ref = doc(db, "orders", data.id);
            await updateDoc(ref, {orderStatus:"Pagado", tip})
            navigation.goBack();
            successHandler('order-created')
        } catch (error) {
            console.log("FinishTableScreen registerOrder ",error);
            errorHandler('order-error', configuration.vibration)
        } finally{
            dispatch(fetchLoadingFinish())
        }
    }

    const formatAmount = (tip:any="") => {
        let totalBuffer = data?.products?.reduce((a:any,b:any)=> a+parseFloat(b.price.replace(/,/g, '.')),0)
        if(userData.user.discount){
            totalBuffer=totalBuffer-(totalBuffer*(userData.user.discount/100));
        }
        if(tip){
            setTip(tip);
            totalBuffer+=parseInt(tip)
        }
        setTotal(totalBuffer);
    }

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView style={{ width: "100%" }}>
                {data?.products?.map((product: any, index:number) => (
                    <OrderDetails
                        key={index}
                        title={`1x ${product.name}`}
                        description={product.description}
                        total={currencyFormat(product.price)}
                    /> 
                ))}
            </ScrollView>
            <StyledCard>
                <StyledRow>
                    <Heading>Descuento aplicado:</Heading>
                    <Heading level="L">{userData.user.discount || '0'}%</Heading>
                </StyledRow>
                <StyledRow>
                    <Heading>Propina:</Heading>
                    <MaskInput placeholderTextColor="gray"
                        value={tip} placeholder="$ 0" keyboardType="number-pad"
                        onChangeText={(masked, unmasked) => {
                            formatAmount(unmasked);
                        }}
                        mask={mask}
                    />
                </StyledRow>
                <Divider />
                <StyledRow>
                    <Heading level="M">Importe total:</Heading>
                    <Heading level="L">{total ? currencyFormat(total.toString()):0}</Heading>
                </StyledRow>
                <Button onPress={registerOrder} size="M">
                    Pagar cuenta
                </Button>
            </StyledCard>
        </StyledView>
    );
};

export default FinishTableScreen;
