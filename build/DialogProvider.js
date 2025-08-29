import React, { createContext, useContext } from "react";
import { PortalProvider } from "./components/PortalProvider";
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
export function DialogProvider({ children, customStyles, }) {
    return (React.createElement(DialogStyleContext.Provider, { value: { ...defaultDialogStyles, ...customStyles } },
        React.createElement(PortalProvider, null, children)));
}
