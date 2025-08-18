import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogAction({ adornmentStart, adornmentEnd, style, children, ...props }) {
    const { action } = useDialogStyles();
    return (React.createElement(TouchableOpacity, { activeOpacity: 0.7, ...props, style: [styles.container, action, style] },
        adornmentStart,
        React.createElement(Text, { style: [
                styles.text,
                (style?.color !== undefined || action?.color !== undefined) && {
                    color: style?.color || action?.color,
                },
                (style?.fontSize !== undefined || action?.fontSize !== undefined) && {
                    fontSize: style?.fontSize || action?.fontSize,
                },
                (style?.fontWeight !== undefined ||
                    action?.fontWeight !== undefined) && {
                    fontWeight: style?.fontWeight || action?.fontWeight,
                },
            ] }, children),
        adornmentEnd));
}
const styles = StyleSheet.create({
    container: {
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
