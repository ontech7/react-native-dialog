import React from "react";
import { type ViewProps } from "react-native";
export type DialogProps = ViewProps & {
    open: boolean;
    onPressOut?: () => Promise<void> | void;
    tint?: "light" | "dark";
    animation?: boolean;
    duration?: number;
    slideFrom?: "top" | "bottom" | "left" | "right" | "none";
    BlurComponent?: React.ComponentType<any>;
};
export declare function Dialog({ open, onPressOut, tint, animation, duration, slideFrom, BlurComponent, style, children, ...props }: DialogProps): React.JSX.Element | null;
