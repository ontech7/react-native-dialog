import { PortalProvider } from "@gorhom/portal";
import React, { createContext, useContext } from "react";
const defaultDialogStyles = {
    container: {},
    header: {},
    body: {},
    footer: {},
    title: {},
    description: {},
    input: {},
    action: {},
};
const DialogStyleContext = createContext(defaultDialogStyles);
export const useDialogStyles = () => useContext(DialogStyleContext);
export function DialogProvider({ children, styles }) {
    return (React.createElement(DialogStyleContext.Provider, { value: { ...defaultDialogStyles, ...styles } },
        React.createElement(PortalProvider, null, children)));
}
