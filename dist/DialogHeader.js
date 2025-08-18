import React from "react";
import { StyleSheet, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogHeader({ style, children, ...props }) {
    const { header } = useDialogStyles();
    return (React.createElement(View, { ...props, style: [styles.container, header, style] }, children));
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 18,
        paddingTop: 18,
        gap: 6,
    },
});
