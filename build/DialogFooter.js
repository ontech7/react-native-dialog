import React from "react";
import { StyleSheet, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";
export function DialogFooter({ style, children, ...props }) {
    const { footer } = useDialogStyles();
    return (React.createElement(View, { ...props, style: [styles.container, footer, style] }, children));
}
const styles = StyleSheet.create({
    container: {
        padding: 18,
        gap: 6,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
});
