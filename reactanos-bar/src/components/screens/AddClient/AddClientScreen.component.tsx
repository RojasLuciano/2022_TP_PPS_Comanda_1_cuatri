import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import {
    StyledLinearGradient,
    StyledMargin,
    StyledView,
} from "./AddClientScreen.styled";
import { Image, StyleSheet, View } from 'react-native';
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import { useForm } from 'react-hook-form';
import ControlledPassword from '../../molecules/ControlledPassword/ControlledPassword.component';
import ImageButton from "../../atoms/ImageButton/ImageButton.component";
import Button from '../../atoms/Button/Button.component';
import { addDoc, collection } from "firebase/firestore";
import { errorHandler } from '../../../utils/ErrorsHandler';
import { auth, db, storage } from '../../../InitApp';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from "@expo/vector-icons";
import { ref, uploadBytes } from 'firebase/storage';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from "expo-image-picker";
import { getBlob } from '../../../utils/utils';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

type NewClient = {
    lastName: string;
    name: string;
    dni: number | null;
    email: string;
    password: string;
    passwordRepeat: string;
}

const AddClientScreen = () => {
    const [image, setImage] = useState("");
    const { control, getValues, formState: { errors }, reset, setValue } = useForm<NewClient>();
    const [scanned, setScanned] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();
    const passInput: MutableRefObject<any> = useRef();

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setOpenQR(false);
        const dataSplit = data.split('@')
        setValue("dni", dataSplit[1].trim())
        setValue("lastName", dataSplit[4].trim())
        setValue("name", dataSplit[2].trim())
    };

    const handleOpenQR = () => {
        setScanned(false);
        setOpenQR(true);
    }

    const onSubmit = async (guest : boolean) => {
        const values = getValues();      
        if(!guest){
            Object.values(values).map(value => {
                if (!value) {
                    showMessage({ type: "danger", message: "Error", description: "Todos los campos son requeridos" });                
                    return;
                }
            })
        }else{
            if(!values.name){
                showMessage({ type: "danger", message: "Error", description: "El nombre es requerido para invitado" });                
                return;
            }
            if(!image){
                showMessage({ type: "danger", message: "Error", description: "La foto es requerida para invitado" });                
                return;
            }
        }
        if (values.password !== values.passwordRepeat) {
            errorHandler('pass-diff');
            return;
        }
        dispatch(fetchLoadingStart());
        try {
            if(!guest){
              await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
              );
              const blob: any = await getBlob(image);
              const fileName = image.substring(image.lastIndexOf("/") + 1);
              const fileRef = ref(storage, "images/" + fileName);
              await uploadBytes(fileRef, blob);
              await addDoc(collection(db, "client"), {
                  lastName: values.lastName,
                  name: values.name,
                  dni: values.dni,
                  email: values.email,
                  image: fileRef.fullPath,
                  creationDate: new Date()
              });
            }else{
                const blob: any = await getBlob(image);
                const fileName = image.substring(image.lastIndexOf("/") + 1);
                const fileRef = ref(storage, "images/" + fileName);
                await uploadBytes(fileRef, blob);
                await addDoc(collection(db, "guest"), {
                  name: values.name,
                  image: fileRef.fullPath,
                  creationDate: new Date(),
                });
            }

            showMessage({
                type: "success",
                message: "Exito",
                description: "Usuario creado exitosamente",
            });
            reset();
            setValue("lastName", "")
            setValue("name", "")
            setValue("dni", null)
            setValue("email", "")
            setValue("password", "")
            setValue("passwordRepeat", "")
            setImage("");
        } catch (error: any) {
            errorHandler(error.code);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    }

    const handleCamera = async (type : any) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result["uri"]);
        }
    };

    useEffect(() => {
        (async () => {
            await BarCodeScanner.requestPermissionsAsync();
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setOpenQR(false);
        }, [])
      );
    
    return !openQR ? (
        <StyledView>
        <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>            
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
              }}
            >          
            {!image ? (
              <ImageButton
                source={require("../../../../assets/add-camera.png")}
                onPress={handleCamera}
              />
            ) : (
              <Image
                style={{
                  height: 185,
                  width: 185,
                  borderRadius: 20,
                  alignSelf: "center",
                }}
                resizeMode="cover"
                source={{ uri: image }}
              />
            )}
            <ImageButton
              source={require("../../../../assets/read-qr.png")}
              onPress={handleOpenQR}
            />
          </View>
          <StyledMargin>
            <ControlledInput
              control={control}
              name="name"
              variant="rounded"
              placeholder="Nombre"
              />
            </StyledMargin>
            <StyledMargin>
            <ControlledInput
              control={control}
              name="lastName"
              variant="rounded"
              placeholder="Apellido"
            />
            </StyledMargin>
            <StyledMargin>
            <ControlledInput
              control={control}
              name="dni"
              variant="rounded"
              placeholder="Documento"
              keyboardType="number-pad"
            />
            </StyledMargin>
            <StyledMargin>
            <ControlledInput
              onSubmitEditing={() => passInput.current.focus()}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              control={control}
              name="email"
              variant="rounded"
            />
            </StyledMargin>
            <StyledMargin>
            <ControlledPassword
              show={show}
              rightIcon={
                <MaterialIcons name={show ? "visibility" : "visibility-off"} />
              }
              onPressRight={() => setShow(!show)}
              ref={passInput}
              placeholder="Contraseña"
              name="password"
              variant="rounded"
              control={control}
            />
            </StyledMargin>
            <StyledMargin>
            <ControlledPassword
              show={show}
              rightIcon={
                <MaterialIcons name={show ? "visibility" : "visibility-off"} />
              }
              onPressRight={() => setShow(!show)}
              placeholder="Repetir contraseña"
              name="passwordRepeat"
              control={control}
              variant="rounded"

            />
            </StyledMargin>
          <Button onPress={() => onSubmit(false)}>Crear usuario</Button>
          <Button onPress={() => onSubmit(true)}>Invitado</Button>
        </StyledLinearGradient>
      </StyledView>
    ) : (
      <BarCodeScanner
        onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    );
}
export default AddClientScreen