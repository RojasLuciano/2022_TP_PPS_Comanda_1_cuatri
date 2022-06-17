import React, { useCallback, useState } from "react";
import {
    StyledLinearGradient,
    StyledMargin,
    StyledView,
} from "./GraphicScreen.styled";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypes } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { StyledParagraph } from "../../atoms/Paragraph/Paragraph.styled";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../InitApp";
import {
    BarChart,
    PieChart,
    ProgressChart,
} from "react-native-chart-kit";
import Button from "../../atoms/Button/Button.component";
import { useFocusEffect } from "@react-navigation/native";
import { fetchLoadingFinish, fetchLoadingStart } from "../../../redux/loaderReducer";
import { sleep } from "../../../utils/utils";

const GraphicScreen = ({ navigation }: any) => {

    const data: AuthTypes = useSelector<IStore, any>(store => store.auth);
    const dispatch = useDispatch();
    const fill = 'rgb(134, 65, 244)'

    // Obtains data from database
    const [pollsCalification, setPollsCalifications] = useState<any>([]);
    const [promedio, setPromedio] = React.useState(0); 

    // que te ha parecido la atencion
    const [greatFood, setgreatFood] = React.useState(0);
    const [goodFood, setgoodFood] = useState(0);
    const [badFood, setbadFood] = useState(0);

    // que te ha parecido el precio 
    const [priceDissatisfied, setPriceDissatisfied] = useState(0);
    const [priceSatisfied, setPriceSatisfied] = useState(0);
    const [priceNormal, setPriceNormal] = useState(0);

    // que te ha parecido la comida slider
    const [food, setFood] = useState(0);
    
    // que crees que deberiamos mejorar
    const [other, setother] = useState(0);
    const [cash, setcash] = useState(0);
    const [creditOrDebit, setcreditOrDebit] = useState(0);
    let promedioDeEncuestas = 0;

    useFocusEffect(
        useCallback(() => {
            getPollsCalifications();
            getDataForGraph();
        }, [])
    );


    const getPollsCalifications = async () => {
        dispatch(fetchLoadingStart());
        setPollsCalifications([]);
        try {
            const q = query(collection(db, "polls"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                const res: any = { ...doc.data(), id: doc.id };
                setPollsCalifications((arr: any) => [...arr, { ...res, id: doc.id }]);
            });
            await sleep(1000);
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };
    
    // Data filtered by user table
    const getDataForGraph = async () => {
        pollsCalification.filter((poll: { PollTable: string; }) => poll.PollTable === data.user.table).map((poll_: any) => {
            if (poll_.PollTasteFood === "great") { 
                setgreatFood(prevCount => prevCount + 1);
            }
            if (poll_.PollTasteFood === "good") {
                setgoodFood(prevCount => prevCount + 1);
            }
            if (poll_.PollTasteFood === "bad") {
                setbadFood(prevCount => prevCount + 1);
            }
            if (poll_.PollPrice === "dissatisfied") {
                setPriceDissatisfied(prevCount => prevCount + 1);
            }
            if (poll_.PollPrice === "satisfied") {
                setPriceSatisfied(prevCount => prevCount + 1);
            }
            if (poll_.PollPrice === "normal") {
                setPriceNormal(prevCount => prevCount + 1);
            }
            if (poll_.PollTasteFood != 0)
                promedioDeEncuestas++;

            if (poll_.PollOther) {
                setother(prevCount => prevCount + 1);
            }
            if (poll_.PollCash) {
                setcash(prevCount => prevCount + 1);
            }
            if (poll_.PollCreditOrDebit) {
                setcreditOrDebit(prevCount => prevCount + 1);
            }
            setFood(prevCount => prevCount + poll_.PollAttention);
        })
        setPromedio(food / promedioDeEncuestas); 
    }
    const resetData = () => {
        setgreatFood(0);
        setgoodFood(0);
        setbadFood(0);
        setPriceDissatisfied(0);
        setPriceSatisfied(0);
        setPriceNormal(0);
        setFood(0);
        setother(0);
        setcash(0);
        setcreditOrDebit(0);
    }
    const AttentionPieChartData = [
        {
            name: "Muy Buena",
            amount: greatFood,
            color: "#000000",
            legendFontColor: "black",
            legendFontSize: 15
        },
        {
            name: "Buena",
            amount: goodFood,
            color: "#999999",
            legendFontColor: "black",
            legendFontSize: 15
        },
        {
            name: "Mala",
            amount: badFood,
            color: "#cccccd",
            legendFontColor: "black",
            legendFontSize: 15
        },
    ]
    const PriceBarChartData = {
        labels: ["Insatisfecho", "Satisfecho", "Normal"],
        datasets: [
            {
                data: [other, cash, creditOrDebit],
            }
        ]
    };
    const PayMethodProgressChartData = {
        labels: ["Efectivo", "Tarjeta", "Otro"],
        data: [priceDissatisfied / 10, priceSatisfied / 10, priceNormal / 10],
    }

    return (
        <StyledLinearGradient colors={["#6190E8", "#A7BFE8"]}>
            <StyledView contentContainerStyle={{ alignItems: 'center' }}>
                <StyledMargin>
                    <StyledParagraph
                        level="L"
                        color="white"
                        bold={true}
                        textAlign="left"
                    >Metodos de pago favoritos
                    </StyledParagraph>
                    <ProgressChart
                        data={PayMethodProgressChartData}
                        width={350}
                        height={150}
                        strokeWidth={10}
                        radius={15}
                        chartConfig={{
                            backgroundGradientFrom: "#72a7e8",
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: "#89b3e8",
                            backgroundGradientToOpacity: 0.5,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5,
                        }}
                    />
                </StyledMargin>

                <StyledMargin>
                    <StyledParagraph
                        level="L"
                        color="white"
                        bold={true}
                        textAlign="left"
                    >
                        Calidad comida
                    </StyledParagraph>

                    <PieChart
                        data={AttentionPieChartData}
                        width={350}
                        height={150}
                        backgroundColor="transparent"
                        chartConfig={{
                            backgroundGradientFrom: "#72a7e8",
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: "#89b3e8",
                            backgroundGradientToOpacity: 0.5,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5,
                            useShadowColorFromDataset: false // optional
                        }}
                        accessor={"amount"}
                        paddingLeft={"0"}
                        center={[50, 0]}
                        absolute
                    />
                </StyledMargin>

                <StyledMargin>
                    <StyledParagraph
                        level="L"
                        color="white"
                        bold={true}
                        textAlign="left"
                    >
                        Calidad precio
                    </StyledParagraph>
                    <BarChart
                        data={PriceBarChartData}
                        yAxisLabel=""
                        yAxisSuffix=""
                        width={350}
                        height={160}
                        chartConfig={{
                            backgroundGradientFrom: "#72a7e8",
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: "#89b3e8",
                            backgroundGradientToOpacity: 0.5,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5,
                            useShadowColorFromDataset: false // optional
                        }}
                        withHorizontalLabels={true}
                    />
                </StyledMargin>

                <StyledMargin>
                    <StyledParagraph
                        level="L"
                        color="white"
                        bold={true}
                        textAlign="left"
                    >
                        Nuestro promedio de atencion es de un {(Math.round(promedio * 100) / 100).toFixed(1)} %
                    </StyledParagraph>
                </StyledMargin>
                <Button onPress={resetData}>reset</Button>

            </StyledView>
        </StyledLinearGradient>
    );
};
export default GraphicScreen;
