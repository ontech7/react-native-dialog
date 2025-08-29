import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogInput({ label, style, wrapperStyle, labelStyle, ...props }) {
    const { input } = useDialogStyles();
    return (React.createElement(View, { style: [styles.wrapper, input?.wrapper, wrapperStyle] },
        label && (React.createElement(Text, { style: [styles.label, input?.label, labelStyle] }, label)),
        React.createElement(TextInput, { cursorColor: "#000", placeholderTextColor: "#777", ...props, style: [styles.input, input?.textInput, style] })));
}
const styles = StyleSheet.create({
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
