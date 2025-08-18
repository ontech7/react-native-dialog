import React from "react";
import type { TextStyle, ViewStyle } from "react-native";
export type DialogStyleConfig = {
    container?: ViewStyle;
    header?: ViewStyle;
    body?: ViewStyle;
    footer?: ViewStyle;
    title?: TextStyle;
    description?: TextStyle;
    input?: TextStyle;
    action?: ViewStyle & Pick<TextStyle, "color" | "fontSize" | "fontWeight">;
};
export declare const useDialogStyles: () => DialogStyleConfig;
export type DialogProviderProps = {
    children: React.ReactNode;
    styles?: DialogStyleConfig;
};
export declare function DialogProvider({ children, styles }: DialogProviderProps): React.JSX.Element;
