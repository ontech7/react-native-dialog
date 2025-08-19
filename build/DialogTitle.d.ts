import React from "react";
import { type TextProps } from "react-native";
export type DialogTitleProps = TextProps & {
    adornmentStart?: React.ReactNode;
    adornmentEnd?: React.ReactNode;
};
export declare function DialogTitle({ children, adornmentStart, adornmentEnd, style, ...props }: DialogTitleProps): React.JSX.Element;
