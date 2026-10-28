"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogBody = DialogBody;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
function DialogBody({ children, style, scrollable = false, scrollViewProps, ...props }) {
    const { body } = (0, theme_1.useDialogStyles)();
    if (scrollable) {
        // Vertical padding stays fixed around the scroll area, so scrolled content
        // is clipped at a gap below the header instead of right against it.
        const { padding, paddingVertical, paddingTop, paddingBottom, paddingHorizontal, ...contentStyle } = react_native_1.StyleSheet.flatten([styles.container, body, style]) ?? {};
        return (react_1.default.createElement(react_native_1.View, { style: [
                styles.scrollFrame,
                {
                    paddingTop: paddingTop ?? paddingVertical ?? padding,
                    paddingBottom: paddingBottom ?? paddingVertical ?? padding,
                },
            ] },
            react_1.default.createElement(react_native_1.ScrollView, { keyboardShouldPersistTaps: "handled", ...props, ...scrollViewProps, style: styles.scroll, contentContainerStyle: [
                    contentStyle,
                    { paddingHorizontal: paddingHorizontal ?? padding },
                ] }, children)));
    }
    return (react_1.default.createElement(react_native_1.View, { ...props, style: [styles.container, body, style] }, children));
}
const styles = react_native_1.StyleSheet.create({
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
