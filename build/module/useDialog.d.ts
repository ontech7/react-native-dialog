import React from "react";
import { type DialogProps } from "./Dialog";
import { type DialogController } from "./DialogControllerContext";
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
    dialogProps?: Omit<DialogProps, "open" | "children" | "onRequestClose" | "onPressOut">;
};
export type DialogConfirmOptions = DialogAlertOptions & {
    /** Label of the cancel action (default: `"Cancel"`). */
    cancelLabel?: string;
    /** Style the confirm action as `destructive` instead of `primary`. */
    destructive?: boolean;
};
export type { DialogController };
/**
 * Imperative dialogs — a themed replacement for `Alert.alert`:
 *
 * ```tsx
 * const dialog = useDialog();
 * if (await dialog.confirm({ title: "Delete note?", destructive: true })) …
 * ```
 */
export declare function useDialog(): DialogController;
/** Holds the queue of imperative dialogs for one `DialogProvider` (and its styles). */
export declare function DialogControllerProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
