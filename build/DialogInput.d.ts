import React from "react";
import type { TextInputProps, TextStyle, ViewStyle } from "react-native";
export type DialogInputProps = TextInputProps & {
    label?: string;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
};
export declare function DialogInput({ label, style, containerStyle, labelStyle, ...props }: DialogInputProps): React.JSX.Element;
