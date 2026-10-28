import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDialogStyles, } from "./theme";
export function DialogAction({ variant, adornmentStart, adornmentEnd, textStyle, style, disabled, children, ...props }) {
    const { action } = useDialogStyles();
    const themed = variant ? action?.variants?.[variant] : undefined;
    const fallback = variant && !themed ? variantStyles[variant] : undefined;
    return (React.createElement(TouchableOpacity, { activeOpacity: 0.7, accessibilityRole: "button", ...props, disabled: disabled, style: [
            styles.button,
            action?.button,
            fallback?.button,
            themed?.button,
            disabled && styles.disabled,
            style,
        ] },
        adornmentStart,
        React.createElement(Text, { style: [
                styles.text,
                action?.text,
                fallback?.text,
                themed?.text,
                textStyle,
            ] }, children),
        adornmentEnd));
}
const styles = StyleSheet.create({
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
