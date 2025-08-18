import React from "react";
import { StyleSheet, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogBody({ children, style, ...props }) {
    const { body } = useDialogStyles();
    return (React.createElement(View, { ...props, style: [styles.container, body, style] }, children));
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 18,
        paddingTop: 18,
        gap: 6,
    },
});
