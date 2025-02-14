import React, { useCallback, useState } from "react";
import {
    StyledLinearGradient,
    StyledMargin,
    StyledView,
} from "./GraphicScreen.styled";
import { useDispatch, useSelector } from "react-redux";
import { AuthTypes, refreshUserData } from "../../../redux/authReducer";
import { IStore } from "../../../redux/store";
import { StyledParagraph } from "../../atoms/Paragraph/Paragraph.styled";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../InitApp";
import {
    BarChart,
    PieChart,
    ProgressChart,
} from "react-native-chart-kit";
import { fetchLoadingFinish, fetchLoadingStart } from "../../../redux/loaderReducer";
import { useFocusEffect } from "@react-navigation/native";

const GraphicScreen = ({ navigation }: any) => {

    const data: AuthTypes = useSelector<IStore, any>(store => store.auth);
    const dispatch = useDispatch();
    const fill = 'rgb(134, 65, 244)'

    // Obtains data from database
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
            onRefresh();
            getPollsCalifications().then(() => {;
            }).catch(error => {console.log(error)})
        }, [])
    );

    const onRefresh = () => {
        dispatch(refreshUserData());
    };
    
    const getPollsCalifications = async () => {
        try {
            resetData();
            const querySnapshot = await (await getDocs(query(collection(db, "polls"), orderBy('creationDate', 'desc'), orderBy('PollTable', 'asc')))); 
            querySnapshot.forEach(async (doc) => {  
                dispatch(fetchLoadingStart());                
                if (doc.data().PollTasteFood === "great") { 
                    setgreatFood(prevCount => prevCount + 1);
                }
                if (doc.data().PollTasteFood === "good") {
                    setgoodFood(prevCount => prevCount + 1);
                }
                if (doc.data().PollTasteFood === "bad") {
                    setbadFood(prevCount => prevCount + 1);
                }
                if (doc.data().PollPrice === "dissatisfied") {
                    setPriceDissatisfied(prevCount => prevCount + 1);
                }
                if (doc.data().PollPrice === "satisfied") {
                    setPriceSatisfied(prevCount => prevCount + 1);
                }
                if (doc.data().PollPrice === "normal") {
                    setPriceNormal(prevCount => prevCount + 1);
                }
                if (doc.data().PollsOpinion != 0){
                    promedioDeEncuestas++;
                }
                if (doc.data().PollOther) {
                    setother(prevCount => prevCount + 1);
                }
                if (doc.data().PollCash) {
                    setcash(prevCount => prevCount + 1);
                }
                if (doc.data().PollCreditOrDebit) {
                    setcreditOrDebit(prevCount => prevCount + 1);
                }
                setFood(prevCount => prevCount + doc.data().PollAttention);                
            }); 
            setPromedio(food / promedioDeEncuestas); 
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(fetchLoadingFinish());
        }
    };    
   
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
            </StyledView>
        </StyledLinearGradient>
    );
};
export default GraphicScreen;
