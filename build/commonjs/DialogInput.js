"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogInput = DialogInput;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogInput({ label, style, wrapperStyle, labelStyle, ...props }) {
    const { input } = (0, theme_1.useDialogStyles)();
    // Default the cursor to the themed text color so it stays visible in dark
    // mode; an explicit `cursorColor` prop still wins (spread after).
    const themedColor = input?.textInput?.color;
    return (react_1.default.createElement(react_native_1.View, { style: [styles.wrapper, input?.wrapper, wrapperStyle] },
        label && (react_1.default.createElement(react_native_1.Text, { style: [styles.label, input?.label, labelStyle] }, label)),
        react_1.default.createElement(react_native_1.TextInput, { cursorColor: themedColor ?? "#000", placeholderTextColor: "#777", accessibilityLabel: label, ...props, style: [styles.input, input?.textInput, style] })));
}
const styles = react_native_1.StyleSheet.create({
    wrapper: {},
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minHeight: 36,
        color: "#000",
    },
    label: {
        marginBottom: 4,
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
});
