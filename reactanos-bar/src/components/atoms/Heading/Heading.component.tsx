import React, { FC } from "react";
import { StyledHeading } from "./Heading.styled";
import { TextProps } from "react-native";

interface HeadingProps extends TextProps {
    color?: string;
    textAlign?: "left" | "center" | "right";
    bold?: boolean;
    level?: "XL" | "L" | "M";
}

const Heading: FC<HeadingProps> = ({
    children,
    color = "black",
    textAlign = "center",
    bold = false,
    level = "M",
    ...props
}) => {
    return (
        <StyledHeading
            bold={bold}
            level={level}
            textAlign={textAlign}
            color={color}
            {...props}
        >
            {children}
        </StyledHeading>
    );
};

export default Heading;
