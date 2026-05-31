import React from "react";
import type { TextStyle, ViewStyle } from "react-native";
export type DialogStyleConfig = {
    container?: ViewStyle;
    header?: ViewStyle;
    body?: ViewStyle;
    footer?: ViewStyle;
    title?: TextStyle;
    description?: TextStyle;
    input?: {
        wrapper?: ViewStyle;
        label?: TextStyle;
        textInput?: TextStyle;
    };
    action?: {
        button?: ViewStyle;
        text?: TextStyle;
    };
};
/**
 * A light/dark pair of styles. Pass it to `DialogProvider` (via `customStyles`)
 * and the active variant is chosen from the device color scheme (or the
 * `colorScheme` override). `dark` falls back to `light` when omitted.
 */
export type DialogStyleTheme = {
    light: DialogStyleConfig;
    dark?: DialogStyleConfig;
};
export declare const useDialogStyles: () => DialogStyleConfig;
export type DialogProviderProps = {
    children: React.ReactNode;
    /**
     * Styles applied in light mode (and the base/fallback). Can also be a
     * `{ light, dark }` theme — e.g. one of the built-in presets (`shadcnStyle`,
     * `materialStyle`) — in which case both variants are read from it.
     */
    customStyles?: DialogStyleConfig | DialogStyleTheme;
    /** Styles applied when the active scheme is dark. Falls back to the light styles when omitted. */
    darkStyles?: DialogStyleConfig;
    /**
     * Active color scheme. Defaults to `"light"` when omitted — pass the device
     * scheme yourself (e.g. from `useColorScheme()`) or your in-app theme value
     * to enable dark mode.
     */
    colorScheme?: "light" | "dark";
};
export declare function DialogProvider({ children, customStyles, darkStyles, colorScheme, }: DialogProviderProps): React.JSX.Element;
