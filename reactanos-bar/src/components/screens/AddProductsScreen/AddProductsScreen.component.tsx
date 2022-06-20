import React, { useCallback, useState } from "react";
import {
    StyledLinearGradient,
    StyledView,
} from "./AddProductsScreen.styled";
import ImageButton from "../../atoms/ImageButton/ImageButton.component";
import * as ImagePicker from "expo-image-picker";
import Modal from "../../atoms/Modal/Modal.component";
import Carousel from "../../molecules/Carousel/Carousel.component";
import { useForm } from "react-hook-form";
import AddProductsController from "../../organisms/AddProductsController/AddProductsController.component";
import { uploadImages } from '../../../utils/utils';
import { errorHandler } from "../../../utils/ErrorsHandler";
import { db } from "../../../InitApp";
import { addDoc, collection } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { fetchLoadingFinish, fetchLoadingStart } from '../../../redux/loaderReducer';
import { successHandler } from "../../../utils/SuccessHandler";
import { Screens } from "../../../navigation/Screens";
import { useFocusEffect } from "@react-navigation/native";

interface ProductData{
    name:string;
    description:string;
    elaborationTime:number;
    price:number;
}

const AddProductsScreen = ({navigation}:any) => {
    const [images, setImages] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const {control, getValues, reset} = useForm<ProductData>();
    const data:AuthTypes = useSelector<IStore, any>(store=>store.auth);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            reset();
        }, [])
    );

    const uploadProduct = async () => {
        try {
            dispatch(fetchLoadingStart());
            const values = getValues();
            const imagesRef = await uploadImages(images);
            const docRef = await addDoc(collection(db, "products"), {
                user: data.user.email,
                creationDate: new Date(),
                images:imagesRef,
                ...values
            });
            navigation.navigate(Screens.QRCode, {
                title: "Producto creado exitosamente",
                subtitle:
                    "El producto ya está cargado en nuestras bases de datos, de todas formas asegurate de guardar el código QR que te brindamos",
                code: JSON.stringify({productCode:docRef.path}),
            });
            successHandler('product-created');
            reset();
        } catch (e:any) {
            console.log(e);
            errorHandler(e.code);
        }finally{
            dispatch(fetchLoadingFinish());
        }
    };

    const handleCamera = async () => {
        let result: any = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.4,
        });
        if (!result.cancelled) {
          if(images.length<2){
            setModalVisible(true);
          }else{
            setModalVisible(false);
          }
          setImages(arr => [...arr, result["uri"]]);
        }
    };

    const handleCancel = () => {
        setImages([]);
        setModalVisible(false);
    }

    return (
        <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
            <StyledView contentContainerStyle={{alignItems:'center'}}>
                <Modal
                    isVisible={modalVisible}
                    title={`${images.length}/3 Fotos agregadas`}
                    subtitle="Es necesario que cargues todas las imágenes del producto"
                    onPrimaryText="Siguiente foto"
                    onPrimary={handleCamera}
                    onSecondaryText="Cancelar"
                    onSecondary={handleCancel}
                />
                {images.length<1 ? 
                    <ImageButton source={require('../../../../assets/add-photo.png')} onPress={handleCamera} /> :
                    <Carousel images={images} />}
                <AddProductsController onPress={uploadProduct} control={control} />
            </StyledView>
        </StyledLinearGradient>
    );
};

export default AddProductsScreen;
