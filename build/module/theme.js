import { createContext, useContext } from "react";
export function isTheme(styles) {
    return !!styles && ("light" in styles || "dark" in styles);
}
export const defaultDialogStyles = {
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
export const DialogStyleContext = createContext(defaultDialogStyles);
export const useDialogStyles = () => useContext(DialogStyleContext);
