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
exports.useDialog = useDialog;
exports.DialogControllerProvider = DialogControllerProvider;
const react_1 = __importStar(require("react"));
const Dialog_1 = require("./Dialog");
const DialogControllerContext_1 = require("./DialogControllerContext");
const DialogAction_1 = require("./DialogAction");
const DialogDescription_1 = require("./DialogDescription");
const DialogFooter_1 = require("./DialogFooter");
const DialogHeader_1 = require("./DialogHeader");
const DialogTitle_1 = require("./DialogTitle");
/**
 * Imperative dialogs — a themed replacement for `Alert.alert`:
 *
 * ```tsx
 * const dialog = useDialog();
 * if (await dialog.confirm({ title: "Delete note?", destructive: true })) …
 * ```
 */
function useDialog() {
    const controller = (0, react_1.useContext)(DialogControllerContext_1.DialogControllerContext);
    if (!controller) {
        throw new Error("[react-native-dialog] useDialog() must be used inside a <DialogProvider>.");
    }
    return controller;
}
let NEXT_REQUEST_ID = 0;
/** Holds the queue of imperative dialogs for one `DialogProvider` (and its styles). */
function DialogControllerProvider({ children, }) {
    const [queue, setQueue] = (0, react_1.useState)([]);
    const [closing, setClosing] = (0, react_1.useState)(false);
    const queueRef = (0, react_1.useRef)(queue);
    queueRef.current = queue;
    // Requests still pending when the provider goes away are cancelled.
    (0, react_1.useEffect)(() => () => queueRef.current.forEach((request) => request.resolve(false)), []);
    const enqueue = (0, react_1.useCallback)((kind, options) => new Promise((resolve) => {
        const request = { id: ++NEXT_REQUEST_ID, kind, options, resolve };
        setQueue((prev) => [...prev, request]);
    }), []);
    const controller = (0, react_1.useMemo)(() => ({
        alert: (options) => enqueue("alert", options).then(() => undefined),
        confirm: (options) => enqueue("confirm", options),
    }), [enqueue]);
    const current = queue[0];
    const answered = (0, react_1.useRef)(null);
    const answer = (confirmed) => {
        if (!current || answered.current === current.id)
            return;
        answered.current = current.id;
        current.resolve(confirmed);
        setClosing(true);
    };
    // Show the next request only once the previous one has finished closing.
    const handleDismiss = () => {
        setClosing(false);
        setQueue((prev) => prev.slice(1));
    };
    return (react_1.default.createElement(DialogControllerContext_1.DialogControllerContext.Provider, { value: controller },
        children,
        current && (react_1.default.createElement(ControlledDialog
        // a fresh instance per request, so each one plays its entrance
        , { 
            // a fresh instance per request, so each one plays its entrance
            key: current.id, request: current, open: !closing, onAnswer: answer, onDismiss: handleDismiss }))));
}
function ControlledDialog({ request, open, onAnswer, onDismiss, }) {
    const { title, description, confirmLabel, cancelLabel = "Cancel", destructive = false, dismissible = true, dialogProps, } = request.options;
    // `Dialog` only animates on an `open` change, so mount closed and open on the
    // next commit to play the entrance animation.
    const [entered, setEntered] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => setEntered(true), []);
    return (react_1.default.createElement(Dialog_1.Dialog, { slideFrom: "center", ...dialogProps, open: open && entered, onRequestClose: dismissible ? () => onAnswer(false) : undefined, onDismiss: () => {
            dialogProps?.onDismiss?.();
            onDismiss();
        } },
        react_1.default.createElement(DialogHeader_1.DialogHeader, null,
            react_1.default.createElement(DialogTitle_1.DialogTitle, null, title),
            description != null && (react_1.default.createElement(DialogDescription_1.DialogDescription, null, description))),
        react_1.default.createElement(DialogFooter_1.DialogFooter, null,
            request.kind === "confirm" && (react_1.default.createElement(DialogAction_1.DialogAction, { variant: "secondary", onPress: () => onAnswer(false) }, cancelLabel)),
            react_1.default.createElement(DialogAction_1.DialogAction, { variant: destructive ? "destructive" : "primary", onPress: () => onAnswer(true) }, confirmLabel ?? (request.kind === "alert" ? "OK" : "Confirm")))));
}
