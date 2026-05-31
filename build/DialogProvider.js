import React, { createContext, useContext } from "react";
import { PortalProvider } from "./components/PortalProvider";
function isTheme(styles) {
    return !!styles && ("light" in styles || "dark" in styles);
}
const defaultDialogStyles = {
    container: {},
    header: {},
    body: {},
    footer: {},
    title: {},
    description: {},
    input: {
        wrapper: {},
        textInput: {},
        label: {},
    },
    action: {
        button: {},
        text: {},
    },
};
const DialogStyleContext = createContext(defaultDialogStyles);
export const useDialogStyles = () => useContext(DialogStyleContext);
export function DialogProvider({ children, customStyles, darkStyles, colorScheme, }) {
    const scheme = colorScheme ?? "light";
    const light = isTheme(customStyles) ? customStyles.light : customStyles;
    const dark = isTheme(customStyles)
        ? (customStyles.dark ?? darkStyles)
        : darkStyles;
    const active = scheme === "dark" ? (dark ?? light) : light;
    return (React.createElement(DialogStyleContext.Provider, { value: { ...defaultDialogStyles, ...active } },
        React.createElement(PortalProvider, null, children)));
}
