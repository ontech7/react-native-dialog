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
exports.useDialogStyles = void 0;
exports.DialogProvider = DialogProvider;
const react_1 = __importStar(require("react"));
const PortalProvider_1 = require("./components/PortalProvider");
const theme_1 = require("./theme");
const useDialog_1 = require("./useDialog");
var theme_2 = require("./theme");
Object.defineProperty(exports, "useDialogStyles", { enumerable: true, get: function () { return theme_2.useDialogStyles; } });
/**
 * Put one at your app root (full screen). Nest more to scope styles, or inside
 * a `Modal` to show dialogs on top of it.
 */
function DialogProvider({ children, customStyles, darkStyles, colorScheme, host = true, }) {
    const hasParentHost = (0, react_1.useContext)(PortalProvider_1.PortalContext) !== null;
    const scheme = colorScheme === "dark" ? "dark" : "light";
    const value = (0, react_1.useMemo)(() => {
        const light = (0, theme_1.isTheme)(customStyles) ? customStyles.light : customStyles;
        const dark = (0, theme_1.isTheme)(customStyles)
            ? (customStyles.dark ?? darkStyles)
            : darkStyles;
        const active = scheme === "dark" ? (dark ?? light) : light;
        return { ...theme_1.defaultDialogStyles, ...active };
    }, [customStyles, darkStyles, scheme]);
    const content = (react_1.default.createElement(theme_1.DialogStyleContext.Provider, { value: value },
        react_1.default.createElement(useDialog_1.DialogControllerProvider, null, children)));
    return host || !hasParentHost ? (react_1.default.createElement(PortalProvider_1.PortalProvider, null, content)) : (content);
}
