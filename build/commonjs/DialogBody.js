"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogBody = DialogBody;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const DialogLayoutContext_1 = require("./DialogLayoutContext");
const theme_1 = require("./theme");
function DialogBody({ children, style, scrollable = false, scrollViewProps, ...props }) {
    const { body } = (0, theme_1.useDialogStyles)();
    const layout = (0, react_1.useContext)(DialogLayoutContext_1.DialogLayoutContext);
    // Before paint, so the dialog is capped from its first frame.
    (0, react_1.useLayoutEffect)(() => (scrollable ? layout?.registerScrollable() : undefined), [scrollable, layout]);
    if (scrollable) {
        const { box, content } = splitScrollableStyle(react_native_1.StyleSheet.flatten([styles.container, body, style]) ?? {});
        return (react_1.default.createElement(react_native_1.View, { ...props, style: [styles.scrollFrame, box] },
            react_1.default.createElement(react_native_1.ScrollView, { keyboardShouldPersistTaps: "handled", ...scrollViewProps, style: styles.scroll, contentContainerStyle: content }, children)));
    }
    return (react_1.default.createElement(react_native_1.View, { ...props, style: [styles.container, body, style] }, children));
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
