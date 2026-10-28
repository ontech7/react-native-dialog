import React from "react";
import { ScrollView, StyleSheet, View, } from "react-native";
import { useDialogStyles } from "./theme";
export function DialogBody({ children, style, scrollable = false, scrollViewProps, ...props }) {
    const { body } = useDialogStyles();
    if (scrollable) {
        // Vertical padding stays fixed around the scroll area, so scrolled content
        // is clipped at a gap below the header instead of right against it.
        const { padding, paddingVertical, paddingTop, paddingBottom, paddingHorizontal, ...contentStyle } = StyleSheet.flatten([styles.container, body, style]) ?? {};
        return (React.createElement(View, { style: [
                styles.scrollFrame,
                {
                    paddingTop: paddingTop ?? paddingVertical ?? padding,
                    paddingBottom: paddingBottom ?? paddingVertical ?? padding,
                },
            ] },
            React.createElement(ScrollView, { keyboardShouldPersistTaps: "handled", ...props, ...scrollViewProps, style: styles.scroll, contentContainerStyle: [
                    contentStyle,
                    { paddingHorizontal: paddingHorizontal ?? padding },
                ] }, children)));
    }
    return (React.createElement(View, { ...props, style: [styles.container, body, style] }, children));
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 18,
        paddingTop: 18,
        gap: 6,
    },
    scrollFrame: {
        flexShrink: 1,
    },
    scroll: {
        flexGrow: 0,
        flexShrink: 1,
    },
});
