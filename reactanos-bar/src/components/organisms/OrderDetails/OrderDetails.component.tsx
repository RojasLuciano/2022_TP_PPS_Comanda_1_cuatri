import { View, Text } from "react-native";
import React, { FC } from "react";
import { StyledView } from "./OrderDetails.styled";
import Heading from "../../atoms/Heading/Heading.component";
import Paragraph from "../../atoms/Paragraph/Paragraph.component";
import Divider from "../../atoms/Divider/Divider.component";
import Button from "../../atoms/Button/Button.component";

interface OrderDetailsProps {
    index: string;
    client: string;
    products: any[];
    total:number | string;
    onPress:()=>void;
}

const OrderDetails: FC<OrderDetailsProps> = ({ index, client, products, total, onPress }) => {
    const groupBy = (xs: any, key: any) => {
        return xs.reduce(function (rv: any, x: any) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    const newList = groupBy(products, 'name');
    return (
        <StyledView>
            <Heading level="L">Pedido {index.substring(0,6)}</Heading>
            <Heading>{client}</Heading>
            <Divider/>
            {Object.keys(newList).map((product:any,index)=>
                <Paragraph textAlign="left" key={index}>
                    - {newList[product].length} {product}
                </Paragraph>
            )}
            <Divider/>
            <Heading textAlign="right" level="L">{total}</Heading>
            <Button size="M" variant="secondary" onPress={onPress}>Aceptar</Button>
        </StyledView>
    );
};

export default OrderDetails;
