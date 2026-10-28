import React from "react";
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";
export type DialogInputProps = TextInputProps & {
    label?: string;
    wrapperStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
};
export declare function DialogInput({ label, style, wrapperStyle, labelStyle, ...props }: DialogInputProps): React.JSX.Element;
