import { View, Text } from "react-native";
import React, { FC } from "react";
import { StyledView } from "./OrderDetails.styled";
import Heading from "../../atoms/Heading/Heading.component";
import Paragraph from "../../atoms/Paragraph/Paragraph.component";
import Divider from "../../atoms/Divider/Divider.component";
import Button from "../../atoms/Button/Button.component";

interface OrderDetailsProps {
    index?: string;
    client?: string;
    products?: any[];
    total?:number | string;
    onPress?:()=>void;
    title?:string;
    onPressText?:string;
    description?:string;
    showStatus?:boolean;
}

const OrderDetails: FC<OrderDetailsProps> = ({ title, index, client, products, total, onPress, onPressText, description, showStatus=false }) => {
    const groupBy = (xs: any, key: any) => {
        return xs.reduce(function (rv: any, x: any) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    const newList = products && groupBy(products, 'name');
    return (
        <StyledView>
            <Heading level="L">{title || "Pedido #" + index?.substring(0,6)}</Heading>
            <Heading>{client}</Heading>
            {<Divider/>}
            {products && Object.keys(newList).map((product:any,index)=>
                <View key={index} style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                    <Paragraph textAlign="left" >
                        - {newList[product].length} {product}
                    </Paragraph>
                    {showStatus && <Paragraph textAlign="right">
                    {newList[product][0]?.status}
                    </Paragraph>}
                </View>
            )}
            {products && <Divider/>}
            {total&&<Heading textAlign="right" level="L">{total}</Heading>}
            {description && <View style={{marginVertical:10}}><Paragraph>{description}</Paragraph></View>}
            {onPress && <Button size="M" variant="secondary" onPress={onPress}>{onPressText || 'Aceptar'}</Button>}
        </StyledView>
    );
};

export default OrderDetails;
