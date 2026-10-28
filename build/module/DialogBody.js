import React, { useContext, useLayoutEffect } from "react";
import { ScrollView, StyleSheet, View, } from "react-native";
import { DialogLayoutContext } from "./DialogLayoutContext";
import { useDialogStyles } from "./theme";
export function DialogBody({ children, style, scrollable = false, scrollViewProps, ...props }) {
    const { body } = useDialogStyles();
    const layout = useContext(DialogLayoutContext);
    // Before paint, so the dialog is capped from its first frame.
    useLayoutEffect(() => (scrollable ? layout?.registerScrollable() : undefined), [scrollable, layout]);
    if (scrollable) {
        const { box, content } = splitScrollableStyle(StyleSheet.flatten([styles.container, body, style]) ?? {});
        return (React.createElement(View, { ...props, style: [styles.scrollFrame, box] },
            React.createElement(ScrollView, { keyboardShouldPersistTaps: "handled", ...scrollViewProps, style: styles.scroll, contentContainerStyle: content }, children)));
    }
    return (React.createElement(View, { ...props, style: [styles.container, body, style] }, children));
}
// Styles that lay out the content go on the scrolling content; everything else
// (background, border, margin, vertical padding…) stays on the body box, as for
// a plain body. The vertical padding staying put means scrolled content is
// clipped at a gap below the header instead of right against it.
const CONTENT_STYLE_KEYS = new Set([
    "paddingHorizontal",
    "paddingLeft",
    "paddingRight",
    "paddingStart",
    "paddingEnd",
    "gap",
    "rowGap",
    "columnGap",
    "flexDirection",
    "flexWrap",
    "alignItems",
    "alignContent",
    "justifyContent",
]);
function splitScrollableStyle(style) {
    const box = {};
    const content = {};
    for (const [key, value] of Object.entries(style)) {
        (CONTENT_STYLE_KEYS.has(key) ? content : box)[key] = value;
    }
    // `padding` covers both sides: vertical on the box, horizontal on the content.
    if (style.padding != null) {
        delete box.padding;
        box.paddingTop = style.paddingTop ?? style.paddingVertical ?? style.padding;
        box.paddingBottom =
            style.paddingBottom ?? style.paddingVertical ?? style.padding;
        content.paddingHorizontal = style.paddingHorizontal ?? style.padding;
    }
    return { box: box, content: content };
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
