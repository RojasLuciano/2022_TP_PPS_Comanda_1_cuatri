import React, { FC, useState } from "react";
import { CheckIcon, Select as NativeSelect } from "native-base";

interface Item {
    label: string;
    value: string;
}

interface SelectProps {
    placeholder?: string;
    data: Item[];
    value: string;
    onChange: (item:string)=>void;
}

const Select: FC<SelectProps> = ({ placeholder, data, onChange, value }) => {
    return (
        <NativeSelect _selectedItem={{
              endIcon: <CheckIcon size="5" />
            }} bgColor="white" height={50} rounded="full"
            placeholder={placeholder} selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)}
        >
            {data.map((item, index) => (
              <NativeSelect.Item
                  key={index}
                  label={item.label}
                  value={item.value}
              />
            ))}
        </NativeSelect>
    );
};

export default Select;
