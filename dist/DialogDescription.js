import React from "react";
import { StyleSheet, Text } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogDescription({ children, style, ...props }) {
    const { description } = useDialogStyles();
    return (React.createElement(Text, { ...props, style: [styles.text, description] }, children));
}
const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: "400",
    },
});
