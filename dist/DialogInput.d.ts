import React from "react";
import type { TextInputProps } from "react-native";
export type DialogInputProps = TextInputProps & {
    label?: string;
};
export declare function DialogInput({ label, style, ...props }: DialogInputProps): React.JSX.Element;
