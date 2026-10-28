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
    // `true` from the first render, so children can call `confirm()` from their
    // own mount effects (which run before this provider's).
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            // StrictMode and Fast Refresh re-run this effect right away: cancel the
            // pending requests only if the provider is really gone.
            Promise.resolve().then(() => {
                if (mounted.current)
                    return;
                queueRef.current.forEach((request) => request.resolve(false));
                queueRef.current = [];
            });
        };
    }, []);
    const enqueue = useCallback((kind, options) => new Promise((resolve) => {
        const request = { id: ++NEXT_REQUEST_ID, kind, options, resolve };
        queueRef.current = [...queueRef.current, request];
        setQueue((prev) => [...prev, request]);
        // e.g. called from a stale closure after the provider unmounted:
        // settle instead of hanging forever. Checked later, because during
        // StrictMode's remount children re-run their effects before this
        // provider is marked mounted again.
        if (!mounted.current) {
            Promise.resolve().then(() => {
                if (!mounted.current)
                    resolve(false);
            });
        }
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
        // animation
        , { 
            // a fresh instance per request, so each one plays its entrance
            // animation
            key: current.id, request: current, open: !closing, onAnswer: answer, onDismiss: handleDismiss }))));
}
function ControlledDialog({ request, open, onAnswer, onDismiss, }) {
    const { title, description, confirmLabel, cancelLabel = "Cancel", destructive = false, dismissible = true, dialogProps, } = request.options;
    return (React.createElement(Dialog, { slideFrom: "center", ...dialogProps, open: open, onRequestClose: dismissible ? () => onAnswer(false) : undefined, onDismiss: () => {
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
