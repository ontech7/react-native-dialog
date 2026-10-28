import React from "react";
import { type DialogStyleConfig, type DialogStyleTheme } from "./theme";
export { useDialogStyles, type DialogActionStyle, type DialogActionVariant, type DialogStyleConfig, type DialogStyleTheme, } from "./theme";
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
     * to enable dark mode. Anything other than `"dark"` selects the light styles.
     */
    colorScheme?: "light" | "dark" | "unspecified" | null;
    /**
     * Whether the dialogs below this provider render here (default: `true`).
     * Keep it for a provider inside a `Modal` or a modal screen, so its dialogs
     * show on top of it. Set it to `false` on a nested provider that only scopes
     * styles (e.g. inside a `ScrollView`): its dialogs then render at the parent
     * provider, covering the whole screen. Ignored on the root provider.
     */
    host?: boolean;
};
/**
 * Put one at your app root (full screen). Nest more to scope styles, or inside
 * a `Modal` to show dialogs on top of it.
 */
export declare function DialogProvider({ children, customStyles, darkStyles, colorScheme, host, }: DialogProviderProps): React.JSX.Element;
