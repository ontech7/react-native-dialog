"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogFooter = DialogFooter;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogFooter({ style, children, ...props }) {
    const { footer } = (0, theme_1.useDialogStyles)();
    return (react_1.default.createElement(react_native_1.View, { ...props, style: [styles.container, footer, style] }, children));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        padding: 18,
        gap: 6,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems: "center",
    },
});
