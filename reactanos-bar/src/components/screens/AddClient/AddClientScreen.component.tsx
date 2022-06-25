import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import {
  StyledLinearGradient,
  StyledMargin,
  StyledView,
} from "./AddClientScreen.styled";
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
import { getBlob, sleep, validateInputs } from '../../../utils/utils';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoadingFinish, fetchLoadingStart } from '../../../redux/loaderReducer';
import { handleLogin } from '../../../redux/authReducer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginStackParamList } from '../../../navigation/stacks/LoginStack';
import { sendPushNotification } from '../../../utils/pushNotifications';
import { successHandler } from '../../../utils/SuccessHandler';
import { ConfigurationTypes } from '../../../redux/configurationReducer';
import { IStore } from '../../../redux/store';
import ControlledCurrency from '../../molecules/ControlledCurrency/ControlledCurrency.component';

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
  const { control, getValues, formState: { errors }, reset, setValue, handleSubmit } = useForm<NewClient>();
  const [scanned, setScanned] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const lastNameInput: MutableRefObject<any> = useRef();
  const dniInput: MutableRefObject<any> = useRef();
  const emailInput: MutableRefObject<any> = useRef();
  const passInput: MutableRefObject<any> = useRef();
  const repeatPassInput: MutableRefObject<any> = useRef();
  const userData: any = useSelector<any>((store) => store.auth);
  const navigation = useNavigation<NativeStackNavigationProp<LoginStackParamList>>()
  const configuration:ConfigurationTypes = useSelector<IStore,any>(store=>store.configuration);

  const handlerSignUp = () => {
    navigation.goBack();
  }

  useEffect(()=>{
    try {
      
      Object.values(errors).map((value) => {
        if (!value.message) {
            throw ({ code: "empty-fields" });
        }
    });
    } catch (error:any) {
      errorHandler(error.code, configuration.vibration)
    }
  },[errors])

  const handleSignIn = (email: string, password: string) => {
    try {
      const values = { email, password };
      dispatch(handleLogin(values));
    } catch (error: any) {
      errorHandler(error.code, configuration.vibration)
    }
  }

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    setOpenQR(false);
    const dataSplit = data.split('@')
    setValue("dni", dataSplit[4].trim())
    setValue("lastName", dataSplit[1].trim())
    setValue("name", dataSplit[2].trim())
  };

  const handleOpenQR = () => {
    setScanned(false);
    setOpenQR(true);
  }

  const generateRandomString = (num: number) => {
    const result = Math.random().toString(36).substring(0, num);
    return result + "@reactanosbar.com";
  }

  const handleOnSubmit = (data:any) => {
    onSubmit(false);
  }

  const onSubmit = async (guest:any) => {
    try {
    const values = getValues();
    if (!guest) {
          validateInputs(values);
    } else {
      if (!values.name) {
        showMessage({ type: "danger", message: "Error", description: "El nombre es requerido para invitado" });
        return;
      }
      if (!image) {
        showMessage({ type: "danger", message: "Error", description: "La foto es requerida para invitado" });
        return;
      }
    }
    if (values.password !== values.passwordRepeat) {
      errorHandler('pass-diff', configuration.vibration);
      return;
    }
    dispatch(fetchLoadingStart());
      if (!guest) {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const blob: any = await getBlob(image);
        const fileName = image.substring(image.lastIndexOf("/") + 1);
        const fileRef = ref(storage, "images/" + fileName);
        await uploadBytes(fileRef, blob);
        await addDoc(collection(db, "users"), {
          lastName: values.lastName,
          name: values.name,
          dni: values.dni,
          email: values.email,
          image: fileRef.fullPath,
          creationDate: new Date(),
          profile: "cliente",
          status: "Pendiente",
          pollfilled: false,
          table: 0,
        });
        await sendPushNotification({title:"Registro", description:"Se registró un nuevo cliente", profile:["supervisor","admin"]})
        await sleep(1000);
        if (userData.user.email === undefined) {
          handlerSignUp();
        }

      } else {
        const blob: any = await getBlob(image);
        const fileName = image.substring(image.lastIndexOf("/") + 1);
        const fileRef = ref(storage, "images/" + fileName);
        const emailGuest = generateRandomString(10);
        await uploadBytes(fileRef, blob);
        await addDoc(collection(db, "users"), {
          name: values.name,
          lastName: values.lastName,
          image: fileRef.fullPath,
          creationDate: new Date(),
          profile: "invitado",
          pollfilled: false,
          table: 0,
          restoStatus: "Pendiente",
          status: "Activo",
          email: emailGuest,
        });
        await createUserWithEmailAndPassword(
          auth,
          emailGuest,
          "123456"
        );
        await sendPushNotification({title:"Registro", description:"Se registró un nuevo invitado", profile:["supervisor","admin"]})
        await sleep(1000);
        if (userData.user.email === undefined) {
          handleSignIn(emailGuest, "123456");
        }
      }
      successHandler("user-created");
      reset();
      setValue("lastName", "")
      setValue("name", "")
      setValue("dni", null)
      setValue("email", "")
      setValue("password", "")
      setValue("passwordRepeat", "")
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
                height: '80%',
                width: '50%',
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
          <ControlledInput error={!!errors.name} required
            onSubmitEditing={() => lastNameInput.current.focus()}
            control={control}
            name="name"
            variant="rounded"
            placeholder="Nombre"
          />
        </StyledMargin>
        <StyledMargin>
          <ControlledInput  error={!!errors.lastName} required
            onSubmitEditing={() => dniInput.current.focus()}
            ref={lastNameInput}
            control={control}
            name="lastName"
            variant="rounded"
            placeholder="Apellido"
          />
        </StyledMargin>
        <StyledMargin>
          <ControlledCurrency  error={!!errors.dni} number required
            onSubmitEditing={() => emailInput.current.focus()}
            ref={dniInput}
            control={control}
            name="dni"
            variant="rounded"
            placeholder="Documento"
            keyboardType="number-pad"
            maxLength={10}
          />
        </StyledMargin>
        <StyledMargin>
          <ControlledInput error={!!errors.email} required
            onSubmitEditing={() => passInput.current.focus()}
            ref={emailInput}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            control={control}
            name="email"
            variant="rounded"
          />
        </StyledMargin>
        <StyledMargin>
          <ControlledPassword error={!!errors.password} required
            show={show}
            rightIcon={
              <MaterialIcons name={show ? "visibility" : "visibility-off"} />
            }
            onPressRight={() => setShow(!show)}
            onSubmitEditing={() => repeatPassInput.current.focus()}
            ref={passInput}
            placeholder="Contraseña"
            name="password"
            variant="rounded"
            control={control}
          />
        </StyledMargin>
        <StyledMargin>
          <ControlledPassword error={!!errors.passwordRepeat} required
            show={show}
            rightIcon={
              <MaterialIcons name={show ? "visibility" : "visibility-off"} />
            }
            onPressRight={() => setShow(!show)}
            placeholder="Repetir contraseña"
            ref={repeatPassInput}
            name="passwordRepeat"
            control={control}
            variant="rounded"

          />
        </StyledMargin>
        <Button onPress={handleSubmit(handleOnSubmit)}>Crear usuario</Button>
        {userData.user.email === undefined && <Button onPress={() => onSubmit(true)}>Invitado</Button>}
      </StyledLinearGradient>
    </StyledView>
  ) : (

    <BarCodeScanner
      onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
      style={{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{
        width: 200,
        height: 200,
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 30
      }}></View>
    </BarCodeScanner>
  );
}
export default AddClientScreen