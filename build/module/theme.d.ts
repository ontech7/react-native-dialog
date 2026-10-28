import type { TextStyle, ViewStyle } from "react-native";
export type DialogActionVariant = "primary" | "secondary" | "destructive";
export type DialogActionStyle = {
    button?: ViewStyle;
    text?: TextStyle;
};
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
    action?: DialogActionStyle & {
        /** Styles merged over `button` / `text` for `<DialogAction variant="…">`. */
        variants?: Partial<Record<DialogActionVariant, DialogActionStyle>>;
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
export declare function isTheme(styles: DialogStyleConfig | DialogStyleTheme | undefined): styles is DialogStyleTheme;
export declare const defaultDialogStyles: DialogStyleConfig;
export declare const DialogStyleContext: import("react").Context<DialogStyleConfig>;
export declare const useDialogStyles: () => DialogStyleConfig;
