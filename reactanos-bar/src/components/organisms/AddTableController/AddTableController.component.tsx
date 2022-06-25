import React, { FC, useRef, MutableRefObject, useState, useCallback } from "react";
import { StyledMargin, StyledView } from "./AddTableController.styled";
import Button from "../../atoms/Button/Button.component";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import { Control } from "react-hook-form";
import Select from "../../molecules/Select/Select.component";
import { View } from "react-native";

interface AddProductsControllerProps{
  control: Control<any,any>
  onPress:()=>void;
  onChangeType: (value:string)=>void;
}

const AddTableController:FC<AddProductsControllerProps> = ({onPress, control, onChangeType}) => {
    const clientsNumberInput:MutableRefObject<any> = useRef();
    const [type, setType] = useState("");

    const data = [
        {label:"VIP", value:"vip"},
        {label:"Para discapacitados", value:"handicapped"},
        {label:"Estándar", value:"standard"},
        {label:"Familiar (con niños)", value:"family"},
        {label:"Fumadores", value:"smoker"}
    ]

    const handleSelectType = (value:string) => {
        setType(value);
        onChangeType(value);
    }

    return (
        <StyledView>
            <View>
                <StyledMargin>
                    <ControlledInput onSubmitEditing={()=>clientsNumberInput.current.focus()} type="numeric" placeholder="Número de mesa" variant="rounded" control={control} name="tableNumber" />
                </StyledMargin>
                <StyledMargin>
                    <ControlledInput ref={clientsNumberInput} type="numeric" placeholder="Cantidad de comensales" variant="rounded" control={control} name="clientsQuantity" />
                </StyledMargin>
                <StyledMargin>
                    <Select value={type} onChange={handleSelectType} placeholder="Seleccione el tipo" data={data} />
                </StyledMargin>
            </View>
            <Button onPress={onPress}>Agregar</Button>
        </StyledView>
    );
};

export default AddTableController;
