import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Dialog, type DialogProps } from "./Dialog";
import {
  DialogControllerContext,
  type DialogController,
} from "./DialogControllerContext";
import { DialogAction } from "./DialogAction";
import { DialogDescription } from "./DialogDescription";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { DialogTitle } from "./DialogTitle";

export type DialogAlertOptions = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Label of the confirm action (default: `"OK"` for alerts, `"Confirm"` for confirms). */
  confirmLabel?: string;
  /**
   * Whether a backdrop tap / Android back button dismisses the dialog
   * (resolving like the cancel action). Default: `true`.
   */
  dismissible?: boolean;
  /** Props forwarded to the underlying `Dialog` (animation, blur, …). */
  dialogProps?: Omit<
    DialogProps,
    "open" | "children" | "onRequestClose" | "onPressOut"
  >;
};

export type DialogConfirmOptions = DialogAlertOptions & {
  /** Label of the cancel action (default: `"Cancel"`). */
  cancelLabel?: string;
  /** Style the confirm action as `destructive` instead of `primary`. */
  destructive?: boolean;
};

export type { DialogController };

type DialogRequest = {
  id: number;
  kind: "alert" | "confirm";
  options: DialogConfirmOptions;
  resolve: (confirmed: boolean) => void;
};

/**
 * Imperative dialogs — a themed replacement for `Alert.alert`:
 *
 * ```tsx
 * const dialog = useDialog();
 * if (await dialog.confirm({ title: "Delete note?", destructive: true })) …
 * ```
 */
export function useDialog(): DialogController {
  const controller = useContext(DialogControllerContext);

  if (!controller) {
    throw new Error(
      "[react-native-dialog] useDialog() must be used inside a <DialogProvider>."
    );
  }

  return controller;
}

let NEXT_REQUEST_ID = 0;

/** Holds the queue of imperative dialogs for one `DialogProvider` (and its styles). */
export function DialogControllerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] = useState<DialogRequest[]>([]);
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
        if (mounted.current) return;
        queueRef.current.forEach((request) => request.resolve(false));
        queueRef.current = [];
      });
    };
  }, []);

  const enqueue = useCallback(
    (kind: DialogRequest["kind"], options: DialogConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        const request = { id: ++NEXT_REQUEST_ID, kind, options, resolve };
        queueRef.current = [...queueRef.current, request];
        setQueue((prev) => [...prev, request]);

        // e.g. called from a stale closure after the provider unmounted:
        // settle instead of hanging forever. Checked later, because during
        // StrictMode's remount children re-run their effects before this
        // provider is marked mounted again.
        if (!mounted.current) {
          Promise.resolve().then(() => {
            if (!mounted.current) resolve(false);
          });
        }
      }),
    []
  );

  const controller = useMemo<DialogController>(
    () => ({
      alert: (options) => enqueue("alert", options).then(() => undefined),
      confirm: (options) => enqueue("confirm", options),
    }),
    [enqueue]
  );

  const current = queue[0];
  const answered = useRef<number | null>(null);

  const answer = (confirmed: boolean) => {
    if (!current || answered.current === current.id) return;
    answered.current = current.id;
    current.resolve(confirmed);
    setClosing(true);
  };

  // Show the next request only once the previous one has finished closing.
  const handleDismiss = () => {
    setClosing(false);
    setQueue((prev) => prev.slice(1));
  };

  return (
    <DialogControllerContext.Provider value={controller}>
      {children}

      {current && (
        <ControlledDialog
          // a fresh instance per request, so each one plays its entrance
          // animation
          key={current.id}
          request={current}
          open={!closing}
          onAnswer={answer}
          onDismiss={handleDismiss}
        />
      )}
    </DialogControllerContext.Provider>
  );
}

function ControlledDialog({
  request,
  open,
  onAnswer,
  onDismiss,
}: {
  request: DialogRequest;
  open: boolean;
  onAnswer: (confirmed: boolean) => void;
  onDismiss: () => void;
}) {
  const {
    title,
    description,
    confirmLabel,
    cancelLabel = "Cancel",
    destructive = false,
    dismissible = true,
    dialogProps,
  } = request.options;

  return (
    <Dialog
      slideFrom="center"
      {...dialogProps}
      open={open}
      onRequestClose={dismissible ? () => onAnswer(false) : undefined}
      onDismiss={() => {
        dialogProps?.onDismiss?.();
        onDismiss();
      }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description != null && (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter>
        {request.kind === "confirm" && (
          <DialogAction variant="secondary" onPress={() => onAnswer(false)}>
            {cancelLabel}
          </DialogAction>
        )}
        <DialogAction
          variant={destructive ? "destructive" : "primary"}
          onPress={() => onAnswer(true)}
        >
          {confirmLabel ?? (request.kind === "alert" ? "OK" : "Confirm")}
        </DialogAction>
      </DialogFooter>
    </Dialog>
  );
}
