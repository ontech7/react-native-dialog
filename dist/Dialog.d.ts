import React from "react";
import type { ViewProps } from "react-native";
export type DialogProps = ViewProps & {
    open: boolean;
    tint?: "light" | "dark";
    duration?: number;
    slideFrom?: "top" | "bottom" | "left" | "right" | "none";
};
export declare function Dialog({ open, tint, duration, slideFrom, style, children, ...props }: DialogProps): React.JSX.Element | null;
