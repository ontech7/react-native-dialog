import type { DialogAlertOptions, DialogConfirmOptions } from "./useDialog";
export type DialogController = {
    /** Shows a dialog with a single action. Resolves when it is closed. */
    alert: (options: DialogAlertOptions) => Promise<void>;
    /** Shows a confirm/cancel dialog. Resolves `true` on confirm, `false` otherwise. */
    confirm: (options: DialogConfirmOptions) => Promise<boolean>;
};
export declare const DialogControllerContext: import("react").Context<DialogController | null>;
