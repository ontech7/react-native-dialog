import React from "react";
import { StyleSheet, View } from "react-native";
import { useDialogStyles } from "./theme";
export function DialogFooter({ style, children, ...props }) {
    const { footer } = useDialogStyles();
    return (React.createElement(View, { ...props, style: [styles.container, footer, style] }, children));
}
const styles = StyleSheet.create({
    container: {
        padding: 18,
        gap: 6,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems: "center",
    },
});
