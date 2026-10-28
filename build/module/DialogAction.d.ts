import React from "react";
import type { StyleProp, TextStyle, TouchableOpacityProps } from "react-native";
import { type DialogActionVariant } from "./theme";
export type DialogActionProps = TouchableOpacityProps & {
    /**
     * Visual weight of the action. Omit it for the plain action style; the
     * variant styles come from the theme (`action.variants`), with a sensible
     * fallback when the theme doesn't define them.
     */
    variant?: DialogActionVariant;
    textStyle?: StyleProp<TextStyle>;
    adornmentStart?: React.ReactNode;
    adornmentEnd?: React.ReactNode;
};
export declare function DialogAction({ variant, adornmentStart, adornmentEnd, textStyle, style, disabled, children, ...props }: DialogActionProps): React.JSX.Element;
