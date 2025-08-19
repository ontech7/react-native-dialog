import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogInput({ label, style, containerStyle, labelStyle, ...props }) {
    const { input } = useDialogStyles();
    return (React.createElement(View, { style: styles.container },
        label && React.createElement(Text, { style: [styles.label, labelStyle] }, label),
        React.createElement(View, { style: [styles.inputWrapper, containerStyle] },
            React.createElement(TextInput, { cursorColor: "#000", placeholderTextColor: "#777", ...props, style: [styles.input, input, style] }))));
}
const styles = StyleSheet.create({
    container: {},
    inputWrapper: {
        flexDirection: "row",
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 12,
        borderWidth: 1.5,
        borderRadius: 12,
        alignItems: "center",
    },
    input: {
        flex: 1,
        paddingHorizontal: 8,
        color: "#000",
    },
    label: {
        marginBottom: 4,
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
});
