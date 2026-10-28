import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDialogStyles } from "./theme";
export function DialogTitle({ children, adornmentStart, adornmentEnd, style, ...props }) {
    const { title } = useDialogStyles();
    return (React.createElement(View, { style: styles.container },
        adornmentStart,
        React.createElement(Text, { accessibilityRole: "header", ...props, style: [styles.text, title, style] }, children),
        adornmentEnd));
}
const styles = StyleSheet.create({
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
