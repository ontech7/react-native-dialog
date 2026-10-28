"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogDescription = DialogDescription;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogDescription({ children, style, ...props }) {
    const { description } = (0, theme_1.useDialogStyles)();
    return (react_1.default.createElement(react_native_1.Text, { ...props, style: [styles.text, description, style] }, children));
}
const styles = react_native_1.StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: "400",
    },
});
