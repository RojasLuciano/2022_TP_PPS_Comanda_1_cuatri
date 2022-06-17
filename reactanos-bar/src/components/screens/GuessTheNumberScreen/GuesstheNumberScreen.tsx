import React, { useCallback, useState } from "react";
import {
    StyledLinearGradient,
    StyledMargin,
} from "./GuessTheNumberScreen.styled";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { fetchLoadingFinish, fetchLoadingStart } from "../../../redux/loaderReducer";
import { sleep } from "../../../utils/utils";
import { errorHandler } from "../../../utils/ErrorsHandler";
import { StyledParagraph } from "../../atoms/Paragraph/Paragraph.styled";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../../atoms/Button/Button.component";
import { Input, View } from "native-base";
import Heading from "../../atoms/Heading/Heading.component";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../InitApp";
import { Screens } from "../../../navigation/Screens";

const GuessTheNumberScreen = ({ navigation }: any) => {
    const data: AuthTypes = useSelector<IStore, any>(store => store.auth);
    const dispatch = useDispatch();
    const [secretNumber, setSecretNumber] = useState(0);
    const [guess, setGuess] = useState('');
    const [lifes, setLifes] = useState(3);
    const [message, setMessage] = useState('Enviar');
    const [noLifesMessage, setNoLifesMessage] = useState('');
    const discount = [15, 10, 20];
    const random = Math.floor(Math.random() * discount.length);  

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchLoadingStart());
            setSecretNumberHandler();
            dispatch(fetchLoadingFinish());
        }, [])
    );

    const setSecretNumberHandler = async () => {
        await sleep(500);
        setSecretNumber(Math.floor(Math.random() * 20));
    }

    const checkGuessHandler = async () => {
        try {
            await sleep(500);
            if (guess === "" || guess === undefined) {
                throw { code: "empty-fields" };
            }
            if (guess === secretNumber.toString()) {
                setNoLifesMessage('Ganaste un descuento de ' + discount[random] + '%');
                setGuess('');
                applyDiscount();
                await sleep(1500);
                dispatch(fetchLoadingStart());
                navigation.navigate(Screens.CLIENT_HOME, {
                    screen: Screens.CLIENT_HOME,
                });
            } else {
                setNoLifesMessage('No adivinaste, intenta de nuevo!.');
                setLifes(prevCount => prevCount - 1);
                setGuess('');
                await sleep(500);
            }
        } catch (error: any) {
            errorHandler(error.code);
        } finally {
            dispatch(fetchLoadingFinish());
        }
    }

    const applyDiscount = async () => {
        try {
            const userCollection = collection(db, "users");
            const userRef = doc(userCollection, data.user.id);
            await updateDoc(userRef, { discount: discount[random] });
        } catch (error) {
            console.log(error);
        }
    }

    const onChangeHandler = (text: string) => {
        setGuess(text);
        console.log(lifes);
        if (lifes <= 0) {
            setMessage('Reintentar');
            setNoLifesMessage('Ya no tienes vidas, intenta de nuevo!.');
            setLifes(3);
        } else {
            setMessage('Enviar');
        }
    }

    return (
        <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
            <StyledMargin>
                <Heading
                    level="XL"
                    textAlign="center"
                    color="white"
                    bold={true}
                >
                    Adivina el número
                </Heading>
            </StyledMargin>

            <StyledMargin>
                <StyledParagraph
                    level="L"
                    color="white"
                    bold={true}
                    textAlign="center"
                >
                    Puede variar entre 1 y 20
                </StyledParagraph>
            </StyledMargin>

            <StyledMargin>
                <View
                    style={{
                        width: "20%",
                        alignSelf: "center",
                    }}
                >
                    <Input
                        style={{
                            width: 50,
                            fontSize: 40,
                            alignSelf: "center",
                            borderColor: "white",
                            borderWidth: 1,
                            color: "white",
                        }}
                        keyboardType="numeric"
                        onChangeText={onChangeHandler}
                        value={guess.toString()}
                    />
                </View>
            </StyledMargin>

            <StyledMargin>
                <StyledParagraph
                    level="L"
                    color="white"
                    bold={true}
                    textAlign="center"
                >
                    {noLifesMessage}
                </StyledParagraph>
            </StyledMargin>

            <Button onPress={checkGuessHandler} > {message} </Button>
        </StyledLinearGradient>
    );
};
export default GuessTheNumberScreen;




