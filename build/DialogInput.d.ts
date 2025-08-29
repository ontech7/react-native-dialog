import React from "react";
import type { TextInputProps, TextStyle, ViewStyle } from "react-native";
export type DialogInputProps = TextInputProps & {
    label?: string;
    wrapperStyle?: ViewStyle;
    labelStyle?: TextStyle;
};
export declare function DialogInput({ label, style, wrapperStyle, labelStyle, ...props }: DialogInputProps): React.JSX.Element;
