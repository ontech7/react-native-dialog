import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogAction({ adornmentStart, adornmentEnd, textStyle, style, children, ...props }) {
    const { action } = useDialogStyles();
    return (React.createElement(TouchableOpacity, { activeOpacity: 0.7, ...props, style: [styles.button, action?.button, style] },
        adornmentStart,
        React.createElement(Text, { style: [styles.text, action?.text, textStyle] }, children),
        adornmentEnd));
}
const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        padding: 5,
        borderRadius: 8,
        alignItems: "center",
        gap: 6,
    },
    text: {
        fontSize: 16,
    },
});
