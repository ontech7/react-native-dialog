"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDialogStyles = exports.DialogStyleContext = exports.defaultDialogStyles = void 0;
exports.isTheme = isTheme;
const react_1 = require("react");
function isTheme(styles) {
    return !!styles && ("light" in styles || "dark" in styles);
}
exports.defaultDialogStyles = {
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
exports.DialogStyleContext = (0, react_1.createContext)(exports.defaultDialogStyles);
const useDialogStyles = () => (0, react_1.useContext)(exports.DialogStyleContext);
exports.useDialogStyles = useDialogStyles;
