"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogTitle = DialogTitle;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogTitle({ children, adornmentStart, adornmentEnd, style, ...props }) {
    const { title } = (0, theme_1.useDialogStyles)();
    return (react_1.default.createElement(react_native_1.View, { style: styles.container },
        adornmentStart,
        react_1.default.createElement(react_native_1.Text, { accessibilityRole: "header", ...props, style: [styles.text, title, style] }, children),
        adornmentEnd));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    text: {
        fontSize: 22,
        fontWeight: "600",
    },
});
