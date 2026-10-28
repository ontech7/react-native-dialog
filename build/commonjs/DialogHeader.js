"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogHeader = DialogHeader;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogHeader({ style, children, ...props }) {
    const { header } = (0, theme_1.useDialogStyles)();
    return (react_1.default.createElement(react_native_1.View, { ...props, style: [styles.container, header, style] }, children));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        paddingHorizontal: 18,
        paddingTop: 18,
        gap: 6,
    },
});
