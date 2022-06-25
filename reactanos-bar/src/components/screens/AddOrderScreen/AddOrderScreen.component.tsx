import { ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import {
    StyledCard,
    StyledRow,
    StyledView,
} from "./AddOrderScreen.styled";
import Heading from "../../atoms/Heading/Heading.component";
import Button from "../../atoms/Button/Button.component";
import ProductCard from "../../organisms/ProductCard/ProductCard.component";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { sleep, currencyFormat } from '../../../utils/utils';
import { addDoc, collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../InitApp";
import { useFocusEffect } from "@react-navigation/native";
import Divider from "../../atoms/Divider/Divider.component";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { errorHandler } from '../../../utils/ErrorsHandler';
import { successHandler } from '../../../utils/SuccessHandler';
import { getDownloadURL, ref } from "firebase/storage";
import { ConfigurationTypes } from "../../../redux/configurationReducer";

const AddOrderScreen = ({navigation}:any) => {
    const dispatch = useDispatch();
    const [data, setData] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);
    const userData:AuthTypes = useSelector<IStore, any>(store=>store.auth);
    const [orderStatusPending, setOrderStatus] = useState("Pendiente");
    const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);

    useFocusEffect(
        useCallback(() => {
            getDocuments();
        }, [])
    );

    const handleProduct = (product:any,add:boolean) => {
        if(add){
            product.status = "Pendiente";
            setProducts([...products,product])
        }else{
            const index = products.findIndex((prevProduct:any) => prevProduct.id === product.id)
            if(index>-1){
                const newProducts = [...products]
                newProducts.splice(index, 1);
                setProducts(newProducts);
            }
        }
    }

    const getDocuments = async () => {
        dispatch(fetchLoadingStart());
        setData([]);
        setProducts([]);
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "products"))
            );
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), id: doc.id };
                let images: any = [];
                res.images.forEach(async (image: any) => {
                    const imageUrl = await getDownloadURL(ref(storage, image));
                    images.push(imageUrl);
                });
                await sleep(2000);
                setData((arr: any) => [...arr, { ...res, id: doc.id, images }]);
            });
            await sleep(2000);
        } catch (error) {
            console.log("AddOrderScreen getDocuments",error);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };

    const registerOrder = async () => {
       console.log("AddOrderScreen registerOrder ");
       
        try {
            dispatch(fetchLoadingStart())
            await addDoc(collection(db, "orders"), {
                products,
                ...userData.user,
                totalTime:products.reduce((a:any,b:any)=> a+parseInt(b.elaborationTime),0),
                totalAmount:products.reduce((a:any,b:any)=> a+parseFloat(b.price.replace(/,/g, '.')),0),
                creationDate: new Date(),
                orderStatus:orderStatusPending
              });
            const ref = doc(db, "users", userData.user.id);
            await updateDoc(ref, {restoStatus:"Pedido realizado"})
            setProducts([]);
            navigation.goBack();
            successHandler('order-created')
        } catch (error) {
            console.log("AddOrderScreen registerOrder ",error);
            errorHandler('order-error', configuration.vibration)
        } finally{
            dispatch(fetchLoadingFinish())
        }
    }

    const countQuantity = (id:string) => {
        return products.filter((product:any) => product.id===id).length;
    }

    const formatAmount = () => {
        const total = products.reduce((a:any,b:any)=> a+parseFloat(b.price.replace(/,/g, '.')),0)
        return total !== 0 ? currencyFormat(total.toFixed(2).toString()) : total;
    }

    return (
        <StyledView colors={["#6190E8", "#A7BFE8"]}>
            <ScrollView style={{ width: "100%" }}>
                {data.map((product: any) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        quantity={countQuantity(product.id)}
                        elaborationTime={product.elaborationTime}
                        description={product.description}
                        price={product.price}
                        images={product.images}
                        onPress={(add:boolean)=>handleProduct(product,add)}
                    />
                ))}
            </ScrollView>
            <StyledCard>
                <StyledRow>
                    <Heading level="M">Importe total:</Heading>
                    <Heading level="L">{formatAmount()}</Heading>
                    {/* <Heading level="L">{products[0]?.price}</Heading> */}
                </StyledRow>
                <Divider />
                <StyledRow>
                    <Heading>Tiempo estimado:</Heading>
                    <Heading level="L">{products.reduce((a:any,b:any)=> a+parseInt(b.elaborationTime),0)}min</Heading>
                </StyledRow>
                <Button onPress={registerOrder} size="M">
                    Realizar pedido
                </Button>
            </StyledCard>
        </StyledView>
    );
};

export default AddOrderScreen;
