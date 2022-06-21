import React, { FC, useRef, MutableRefObject, useState } from "react";
import { StyledMargin, StyledView } from "./AddProductsController.styled";
import Button from "../../atoms/Button/Button.component";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import { Control } from "react-hook-form";
import ControlledCurrency from "../../molecules/ControlledCurrency/ControlledCurrency.component";
import { View } from "react-native";
import Select from "../../molecules/Select/Select.component";

interface AddProductsControllerProps{
  control: Control<any,any>
  onPress:()=>void;
  onChangeProfile: (value:string)=>void;
}

const AddProductsController:FC<AddProductsControllerProps> = ({onPress, control,onChangeProfile}) => {
    const descInput:MutableRefObject<any> = useRef();
    const timeInput:MutableRefObject<any> = useRef();
    const priceInput:MutableRefObject<any>= useRef();
    const [profile, setProfile] = useState("");

    const handleSelectProfile = (value:string) => {
        setProfile(value);
        onChangeProfile(value);
    }

    const data = [
        {label:"Cocina", value:"cook"},
        {label:"Bar", value:"waiter"},
    ]

    return (
        <StyledView>
            <View>
                <StyledMargin>
                    <ControlledInput onSubmitEditing={()=>descInput.current.focus()} placeholder="Nombre" variant="rounded" control={control} name="name" />
                </StyledMargin>
                <StyledMargin>
                    <ControlledInput ref={descInput} onSubmitEditing={()=>timeInput.current.focus()} placeholder="Descripción" variant="rounded" control={control} name="description" />
                </StyledMargin>
                <StyledMargin>
                    <ControlledInput ref={timeInput} onSubmitEditing={()=>priceInput.current.focus()}  type="numeric" placeholder="Tiempo de elaboración" variant="rounded" control={control} name="elaborationTime" />
                </StyledMargin>
                <StyledMargin>
                    <ControlledCurrency ref={priceInput} placeholder="Precio" control={control} name="price" />
                </StyledMargin>
                <StyledMargin>
                    <Select value={profile} onChange={handleSelectProfile} placeholder="Seleccione el sector" data={data} />
                </StyledMargin>
            </View>
            <Button onPress={onPress}>Agregar</Button>
        </StyledView>
    );
};

export default AddProductsController;


