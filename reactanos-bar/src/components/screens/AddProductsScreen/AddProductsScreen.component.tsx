import React, { useState } from "react";
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
import { getBlob, uploadImages } from "../../../utils/utils";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { showMessage } from "react-native-flash-message";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../InitApp";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";

interface ProductData{
    name:string;
    description:string;
    elaborationTime:number;
    price:number;
}

const AddProductsScreen = () => {
    const [images, setImages] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const {control, getValues} = useForm<ProductData>();
    const data:AuthTypes = useSelector<IStore, any>(store=>store.auth);

    const uploadProduct = async () => {
        try {
            const values = getValues();
            if(images.length<3 ||  !values.name || !values.description || !values.elaborationTime || !values.price){
                showMessage({type:"danger", message:"Error", description:"Todos los campos son requeridos"});
                return
            }
            const imagesRef = await uploadImages(images);
            await addDoc(collection(db, "products"), {
                user: data.user.email,
                creationDate: new Date(),
                images:imagesRef,
                ...values
            });
            showMessage({
                type: "success",
                message: "Exito",
                description: "Producto cargado exitosamente",
            });
        } catch (e) {
            console.log(e);
            errorHandler("image-error");
        }
    };

    const handleCamera = async () => {
        let result: any = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
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
        <StyledView>
            <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
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
            </StyledLinearGradient>
        </StyledView>
    );
};

export default AddProductsScreen;
