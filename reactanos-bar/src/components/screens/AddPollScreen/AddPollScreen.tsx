import React, { MutableRefObject, useCallback, useRef, useState } from "react";
import {
    StyledLinearGradient,
    StyledMargin,
    StyledView,
} from "./AddPollScreen.styled";
import ImageButton from "../../atoms/ImageButton/ImageButton.component";
import * as ImagePicker from "expo-image-picker";
import Modal from "../../atoms/Modal/Modal.component";
import Carousel from "../../molecules/Carousel/Carousel.component";
import { useForm } from "react-hook-form";
import { uploadImages, validateInputs } from "../../../utils/utils";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { db } from "../../../InitApp";
import { addDoc, collection } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import {
    fetchLoadingFinish,
    fetchLoadingStart,
} from "../../../redux/loaderReducer";
import { successHandler } from "../../../utils/SuccessHandler";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../../atoms/Button/Button.component";
import { StyledParagraph } from "../../atoms/Paragraph/Paragraph.styled";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import Select from "../../molecules/Select/Select.component";
import { Box, Slider, Checkbox, Radio } from "native-base";
import { Screens } from "../../../navigation/Screens";
import Heading from "../../atoms/Heading/Heading.component";
import { ConfigurationTypes } from "../../../redux/configurationReducer";
import { View } from "react-native";

interface PollData {
    name: string;
    attention: string;
    elaborationTime: number;
}
const AddPollScreen = ({ navigation }: any) => {
    const [images, setImages] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { control, getValues, reset, handleSubmit } = useForm<PollData>();
    const [foodQuality, setFoodQuality] = useState("");
    const opinion: MutableRefObject<any> = useRef();
    const [price, setPollsPrice] = useState("");
    const data: AuthTypes = useSelector<IStore, any>((store) => store.auth);
    const dispatch = useDispatch();
    const [onChangeSliderValue, setOnChangeSliderValue] = useState(70); //slider value
    const [creditOrDebit, setcreditOrDebit] = useState(false);
    const [cash, setcash] = useState(false);
    const [other, setother] = useState(false);
    const [userAlreadyFilledPoll, setUserAlreadyFilledPoll] = useState(false);
    const configuration: ConfigurationTypes = useSelector<IStore, any>(
        (store) => store.configuration
    );

    const dataAttention = [
        { label: "Muy buena", value: "great" },
        { label: "Buena", value: "good" },
        { label: "Mala", value: "bad" },
    ];

    const OtherReset = () => {
        setFoodQuality("");
        opinion.current = "";
        setOnChangeSliderValue(70);
        setcreditOrDebit(false);
        setcash(false);
        setother(false);
        setPollsPrice("");
    };

    const handleSelectAttention = (value: string) => {
        setFoodQuality(value);
    };
    useFocusEffect(
        useCallback(() => {
            reset();
            OtherReset();
        }, [])
    );

    const uploadPoll = async () => {
        try {
            setUserAlreadyFilledPoll(true);
            dispatch(fetchLoadingStart());
            const values = getValues();
            validateInputs(values);
            const imagesRef = await uploadImages(images);
            const docRef = await addDoc(collection(db, "polls"), {
                user: data.user.email,
                PollTable: data.user.table,
                PollAttention: onChangeSliderValue,
                PollPrice: price,
                PollTasteFood: foodQuality,
                PollCreditOrDebit: creditOrDebit,
                PollOther: other,
                PollCash: cash,
                PollAlreadyFilled: userAlreadyFilledPoll,
                creationDate: new Date(),
                images: imagesRef,
                ...values,
            });
            successHandler("poll-created");
            navigation.navigate(Screens.CLIENT_HOME, {
                screen: Screens.CLIENT_HOME,
            });
            reset();
            OtherReset();
        } catch (e: any) {
            console.log(e);
            errorHandler(e.code, configuration.vibration);
        } finally {
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
            if (images.length < 2) {
                setModalVisible(true);
            } else {
                setModalVisible(false);
            }
            setImages((arr) => [...arr, result["uri"]]);
        }
    };

    const handleCancel = () => {
        setImages([]);
        setModalVisible(false);
    };

    return (
        <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
            <StyledView contentContainerStyle={{ padding: "5%" }}>
                {data.user.pollfilled ? (
                    <StyledMargin>
                        <Heading
                            level="XL"
                            textAlign="center"
                            color="white"
                            bold={true}
                        >
                            Ya completaste la encuesta!.{"\n"} Gracias por tu
                            participación.
                        </Heading>
                    </StyledMargin>
                ) : (
                    <View style={{ width: "100%" }}>
                        <Modal
                            isVisible={modalVisible}
                            title={`${images.length}/3 Fotos agregadas`}
                            subtitle="Es necesario que cargues todas las imágenes para la encuesta"
                            onPrimaryText="Siguiente foto"
                            onPrimary={handleCamera}
                            onSecondaryText="Cancelar"
                            onSecondary={handleCancel}
                        />
                        <View style={{ alignItems: "center" }}>
                            {images.length < 1 ? (
                                <ImageButton
                                    source={require("../../../../assets/add-photo.png")}
                                    onPress={handleCamera}
                                />
                            ) : (
                                <Carousel images={images} />
                            )}
                        </View>
                        <StyledMargin>
                            <StyledParagraph
                                level="L"
                                color="white"
                                bold={true}
                                textAlign="left"
                            >
                                • ¿Que te ha parecido la comida?
                            </StyledParagraph>
                        </StyledMargin>

                        <StyledMargin>
                            <Select
                                value={foodQuality}
                                onChange={handleSelectAttention}
                                placeholder="Tu respuesta nos ayuda a mejorar"
                                data={dataAttention}
                            />
                        </StyledMargin>

                        <StyledMargin>
                            <StyledParagraph
                                level="L"
                                color="white"
                                bold={true}
                                textAlign="left"
                            >
                                • ¿Que te ha parecido el precio?
                            </StyledParagraph>
                        </StyledMargin>

                        <StyledMargin>
                            <Radio.Group
                                name="myRadioGroup"
                                value={price}
                                onChange={(price) => {
                                    setPollsPrice(price);
                                }}
                            >
                                <Radio value="dissatisfied">Insatisfecho</Radio>
                                <Radio value="satisfied">Satisfecho</Radio>
                                <Radio value="normal">Normal</Radio>
                            </Radio.Group>
                        </StyledMargin>
                        <StyledMargin>
                            <StyledParagraph
                                level="L"
                                color="white"
                                bold={true}
                                textAlign="left"
                            >
                                • ¿Que te ha parecido la atencion?
                            </StyledParagraph>
                        </StyledMargin>
                        <StyledMargin>
                            <Box alignItems="center" w="100%">
                                <Slider
                                    w="3/4"
                                    maxW="300"
                                    defaultValue={70}
                                    minValue={0}
                                    maxValue={100}
                                    accessibilityLabel="hello world"
                                    step={10}
                                    size="sm"
                                    colorScheme="cyan"
                                    onChange={(v) => {
                                        setOnChangeSliderValue(Math.floor(v));
                                    }}
                                    onChangeEnd={(v) => {
                                        v;
                                    }}
                                >
                                    <Slider.Track>
                                        <Slider.FilledTrack />
                                    </Slider.Track>
                                    <Slider.Thumb />
                                </Slider>
                            </Box>
                        </StyledMargin>
                        <StyledMargin>
                            <StyledParagraph
                                level="L"
                                color="white"
                                bold={true}
                                textAlign="left"
                            >
                                • ¿Metodo favorito de pago?
                            </StyledParagraph>
                        </StyledMargin>
                        <Checkbox
                            value={"creditOrDebit"}
                            onChange={() => {
                                setcreditOrDebit(!creditOrDebit);
                            }}
                            isChecked={creditOrDebit}
                        >
                            Tarjeta de crédito o débito
                        </Checkbox>
                        <Checkbox
                            value={"cash"}
                            onChange={() => {
                                setcash(!cash);
                            }}
                            isChecked={cash}
                        >
                            Efectivo
                        </Checkbox>
                        <Checkbox
                            value={"other"}
                            onChange={() => {
                                setother(!other);
                            }}
                            isChecked={other}
                        >
                            Otro
                        </Checkbox>
                        <StyledMargin>
                            <StyledParagraph
                                level="L"
                                color="white"
                                bold={true}
                                textAlign="left"
                            >
                                • Dejanos tu opinion sobre el servicio
                            </StyledParagraph>
                        </StyledMargin>
                        <StyledMargin>
                            <ControlledInput
                                onSubmitEditing={() => opinion.current.focus()}
                                placeholder="Tu respuesta nos ayuda a mejorar"
                                variant="rounded"
                                control={control}
                                name="PollsOpinion"
                            />
                        </StyledMargin>
                        <Button onPress={handleSubmit(uploadPoll)}>
                            Enviar
                        </Button>
                    </View>
                )}
            </StyledView>
        </StyledLinearGradient>
    );
};
export default AddPollScreen;
