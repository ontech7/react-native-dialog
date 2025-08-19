import React from "react";
import type { TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";
export type DialogActionProps = TouchableOpacityProps & {
    style?: ViewStyle & Pick<TextStyle, "color" | "fontSize" | "fontWeight">;
    adornmentStart?: React.ReactNode;
    adornmentEnd?: React.ReactNode;
};
export declare function DialogAction({ adornmentStart, adornmentEnd, style, children, ...props }: DialogActionProps): React.JSX.Element;
