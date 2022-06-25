import React, {MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import {
    StyledLinearGradient,
    StyledMargin,
    StyledView,
} from "./AddAdminsScreen.styled";
import { Image, View } from 'react-native';
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
import Select from '../../molecules/Select/Select.component';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoadingFinish, fetchLoadingStart } from '../../../redux/loaderReducer';
import { successHandler } from '../../../utils/SuccessHandler';
import { ConfigurationTypes } from '../../../redux/configurationReducer';
import { IStore } from '../../../redux/store';

type NewUser = {
    lastName: string;
    name: string;
    dni: number | null;
    cuil: string;
    profile: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

const AddAdminsScreen = ({navigation}:any) => {
    const [image, setImage] = useState("");
    const { control, handleSubmit, getValues, formState: { errors }, reset, setValue } = useForm<NewUser>();
    const [scanned, setScanned] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [show, setShow] = useState(false);
    const passInput: MutableRefObject<any> = useRef();
    const [type, setType] = useState("");
    const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);
    const dispatch = useDispatch();

    const verifyCuil = (cuit : any) => {
        if (cuit.length !== 11) {
          return false;
        }  
        return true;
      };      
      
    const data = [
        {label:"Dueño", value:"admin"},
        {label:"Supervisor", value:"supervisor"},
    ]
    const handleSelectType = (value:string) => {
        setType(value);
        setValue("profile",value);
    }

      React.useEffect(
        () =>
          navigation.addListener('beforeRemove', (e:any) => {
            e.preventDefault();
          }),
        []
      );

      useFocusEffect(
        useCallback(() => {
            setOpenQR(false);
        }, [])
      );

    const handleBarCodeScanned = ({ data }:any) => {
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

    const onSubmit = async () => {
        const values = getValues();
        let error = false;
        Object.values(values).map(value => {
            if (!value) {
                error = true;
                return;
            }
        })
        if (!verifyCuil(values.cuil)) {
            showMessage({ type: "danger", message: "Error", description: "CUIL INVAlIDO" });
            return;
        }

        if (error || !image) {
            showMessage({ type: "danger", message: "Error", description: "Todos los campos son requeridos" });
            return;
        }
        if (values.password !== values.passwordRepeat) {
            errorHandler('pass-diff', configuration.vibration);
            return;
        }
        dispatch(fetchLoadingStart());
       
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            const blob: any = await getBlob(image);
            const fileName = image.substring(image.lastIndexOf("/") + 1);
            const fileRef = ref(storage, "images/" + fileName);
            await uploadBytes(fileRef, blob);
            await addDoc(collection(db, "users"), {
                lastName: values.lastName,
                name: values.name,
                dni: values.dni,
                cuil: values.cuil,
                profile: values.profile,
                email: values.email,
                image: fileRef.fullPath,
                creationDate: new Date(),
                status: "Activo",
                pollfilled: false,
            });
            successHandler('user-created');
            reset();
            setValue("lastName", "")
            setValue("name", "")
            setValue("dni", null)
            setValue("cuil", "")
            setValue("profile", "")
            setValue("email", "")
            setValue("password", "")
            setValue("passwordRepeat", "")
            setType("");
            setImage("");
        } catch (error: any) {
            errorHandler(error.code, configuration.vibration);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    }

    const handleCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.4,
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

    return (
        !openQR ?
            <StyledView>
                <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
                    <View style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                    }}>
                        {!image ?
                            <ImageButton source={require('../../../../assets/add-camera.png')} onPress={handleCamera} /> :
                            <Image style={{
                                height: 185,
                                width: 185,
                                borderRadius: 20,
                                alignSelf: 'center',
                            }} resizeMode="cover" source={{ uri: image }} />
                        }
                        <ImageButton source={require('../../../../assets/read-qr.png')} onPress={handleOpenQR} />
                    </View>

                    <StyledMargin>
                        <ControlledInput
                            variant="rounded"
                            control={control}
                            name="lastName"
                            placeholder='Apellido'
                        />
                    </StyledMargin>

                    <StyledMargin>
                        <ControlledInput
                            variant="rounded"
                            control={control}
                            name="name"
                            placeholder='Nombres'
                        />
                    </StyledMargin>


                    <StyledMargin>
                        <ControlledInput
                            variant="rounded"
                            control={control}
                            name="dni"
                            placeholder='Documento'
                            keyboardType='number-pad'
                        />
                    </StyledMargin>

                    <StyledMargin>
                        <ControlledInput
                            variant="rounded"
                            control={control}
                            name="cuil"
                            placeholder='CUIL'
                        />
                    </StyledMargin>

                    <StyledMargin>
                       <Select value={type} onChange={handleSelectType} placeholder="Perfil" data={data} />
                    </StyledMargin>

                    <StyledMargin>
                        <ControlledInput
                            variant="rounded"
                            onSubmitEditing={() => passInput.current.focus()}
                            placeholder="Correo electrónico"
                            keyboardType="email-address"
                            control={control}
                            name="email"
                        />
                    </StyledMargin>

                    <StyledMargin>
                    <ControlledPassword
                       variant="rounded"
                        show={show}
                        rightIcon={
                            <MaterialIcons
                                name={show ? "visibility" : "visibility-off"}
                            />
                        }
                        onPressRight={() => setShow(!show)}
                        ref={passInput}
                        placeholder="Contraseña"
                        name="password"
                        control={control}
                    />
                    </StyledMargin>

                    <StyledMargin>
                    <ControlledPassword
                     variant="rounded"
                        show={show}
                        rightIcon={
                            <MaterialIcons
                                name={show ? "visibility" : "visibility-off"}
                            />
                        }
                        onPressRight={() => setShow(!show)}
                        placeholder="Repetir contraseña"
                        name="passwordRepeat"
                        control={control}
                    />
                    </StyledMargin>

                    <Button onPress={handleSubmit(onSubmit)}>Crear usuario</Button>
                </StyledLinearGradient>
            </StyledView> :     <BarCodeScanner
      onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
      style={{        
        flex: 1,
        backgroundColor: 'black',                
        alignItems: 'center',
        justifyContent: 'center',  }}
    >
      <View style={{
        width: 200,
        height: 200,
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 30
      }}></View>
    </BarCodeScanner>
    )
}
export default AddAdminsScreen
