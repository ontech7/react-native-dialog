import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { Dialog } from "./Dialog";
import { DialogControllerContext, } from "./DialogControllerContext";
import { DialogAction } from "./DialogAction";
import { DialogDescription } from "./DialogDescription";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { DialogTitle } from "./DialogTitle";
/**
 * Imperative dialogs — a themed replacement for `Alert.alert`:
 *
 * ```tsx
 * const dialog = useDialog();
 * if (await dialog.confirm({ title: "Delete note?", destructive: true })) …
 * ```
 */
export function useDialog() {
    const controller = useContext(DialogControllerContext);
    if (!controller) {
        throw new Error("[react-native-dialog] useDialog() must be used inside a <DialogProvider>.");
    }
    return controller;
}
let NEXT_REQUEST_ID = 0;
/** Holds the queue of imperative dialogs for one `DialogProvider` (and its styles). */
export function DialogControllerProvider({ children, }) {
    const [queue, setQueue] = useState([]);
    const [closing, setClosing] = useState(false);
    const queueRef = useRef(queue);
    queueRef.current = queue;
    // Requests still pending when the provider goes away are cancelled.
    useEffect(() => () => queueRef.current.forEach((request) => request.resolve(false)), []);
    const enqueue = useCallback((kind, options) => new Promise((resolve) => {
        const request = { id: ++NEXT_REQUEST_ID, kind, options, resolve };
        setQueue((prev) => [...prev, request]);
    }), []);
    const controller = useMemo(() => ({
        alert: (options) => enqueue("alert", options).then(() => undefined),
        confirm: (options) => enqueue("confirm", options),
    }), [enqueue]);
    const current = queue[0];
    const answered = useRef(null);
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
    return (React.createElement(DialogControllerContext.Provider, { value: controller },
        children,
        current && (React.createElement(ControlledDialog
        // a fresh instance per request, so each one plays its entrance
        , { 
            // a fresh instance per request, so each one plays its entrance
            key: current.id, request: current, open: !closing, onAnswer: answer, onDismiss: handleDismiss }))));
}
function ControlledDialog({ request, open, onAnswer, onDismiss, }) {
    const { title, description, confirmLabel, cancelLabel = "Cancel", destructive = false, dismissible = true, dialogProps, } = request.options;
    // `Dialog` only animates on an `open` change, so mount closed and open on the
    // next commit to play the entrance animation.
    const [entered, setEntered] = useState(false);
    useEffect(() => setEntered(true), []);
    return (React.createElement(Dialog, { slideFrom: "center", ...dialogProps, open: open && entered, onRequestClose: dismissible ? () => onAnswer(false) : undefined, onDismiss: () => {
            dialogProps?.onDismiss?.();
            onDismiss();
        } },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null, title),
            description != null && (React.createElement(DialogDescription, null, description))),
        React.createElement(DialogFooter, null,
            request.kind === "confirm" && (React.createElement(DialogAction, { variant: "secondary", onPress: () => onAnswer(false) }, cancelLabel)),
            React.createElement(DialogAction, { variant: destructive ? "destructive" : "primary", onPress: () => onAnswer(true) }, confirmLabel ?? (request.kind === "alert" ? "OK" : "Confirm")))));
}
