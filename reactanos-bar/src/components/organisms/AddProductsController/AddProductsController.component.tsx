import React, { FC, useRef, MutableRefObject, useState } from "react";
import { StyledMargin, StyledView } from "./AddProductsController.styled";
import Button from "../../atoms/Button/Button.component";
import ControlledInput from "../../molecules/ControlledInput/ControlledInput.component";
import { Control } from "react-hook-form";
import MaskInput, { createNumberMask, Masks } from 'react-native-mask-input';
import ControlledCurrency from "../../molecules/ControlledCurrency/ControlledCurrency.component";

interface AddProductsControllerProps{
  control: Control<any,any>
  onPress:()=>void;
}

const AddProductsController:FC<AddProductsControllerProps> = ({onPress, control}) => {
    const descInput:MutableRefObject<any> = useRef();
    const timeInput:MutableRefObject<any> = useRef();
    const priceInput:MutableRefObject<any> = useRef();

    return (
        <StyledView>
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
                <ControlledCurrency placeholder="Precio" control={control} name="price" />
            </StyledMargin>
            <StyledMargin>
                <Button onPress={onPress}>Agregar</Button>
            </StyledMargin>
        </StyledView>
    );
};

export default AddProductsController;
