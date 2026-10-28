import React, { useContext, useMemo } from "react";
import { PortalContext, PortalProvider } from "./components/PortalProvider";
import { defaultDialogStyles, DialogStyleContext, isTheme, } from "./theme";
import { DialogControllerProvider } from "./useDialog";
export { useDialogStyles, } from "./theme";
/**
 * Put one at your app root (full screen). Nest more to scope styles, or inside
 * a `Modal` to show dialogs on top of it.
 */
export function DialogProvider({ children, customStyles, darkStyles, colorScheme, host = true, }) {
    const hasParentHost = useContext(PortalContext) !== null;
    const scheme = colorScheme === "dark" ? "dark" : "light";
    const value = useMemo(() => {
        const light = isTheme(customStyles) ? customStyles.light : customStyles;
        const dark = isTheme(customStyles)
            ? (customStyles.dark ?? darkStyles)
            : darkStyles;
        const active = scheme === "dark" ? (dark ?? light) : light;
        return { ...defaultDialogStyles, ...active };
    }, [customStyles, darkStyles, scheme]);
    const content = (React.createElement(DialogStyleContext.Provider, { value: value },
        React.createElement(DialogControllerProvider, null, children)));
    return host || !hasParentHost ? (React.createElement(PortalProvider, null, content)) : (content);
}
