"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogAction = DialogAction;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogAction({ variant, adornmentStart, adornmentEnd, textStyle, style, disabled, children, ...props }) {
    const { action } = (0, theme_1.useDialogStyles)();
    const themed = variant ? action?.variants?.[variant] : undefined;
    const fallback = variant && !themed ? variantStyles[variant] : undefined;
    return (react_1.default.createElement(react_native_1.TouchableOpacity, { activeOpacity: 0.7, accessibilityRole: "button", ...props, disabled: disabled, style: [
            styles.button,
            action?.button,
            fallback?.button,
            themed?.button,
            disabled && styles.disabled,
            style,
        ] },
        adornmentStart,
        react_1.default.createElement(react_native_1.Text, { style: [
                styles.text,
                action?.text,
                fallback?.text,
                themed?.text,
                textStyle,
            ] }, children),
        adornmentEnd));
}
const styles = react_native_1.StyleSheet.create({
    button: {
        flexDirection: "row",
        maxWidth: "100%",
        padding: 5,
        borderRadius: 8,
        alignItems: "center",
        gap: 6,
    },
    text: {
        flexShrink: 1,
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
});
// Used when the theme has no `action.variants` entry, so variants still read
// differently with the default (or a custom) theme.
const variantStyles = {
    primary: { text: { fontWeight: "600" } },
    secondary: { text: { opacity: 0.65 } },
    destructive: { text: { color: "#dc2626", fontWeight: "600" } },
};
