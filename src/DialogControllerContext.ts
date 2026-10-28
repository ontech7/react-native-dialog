import { createContext } from "react";

import type { DialogAlertOptions, DialogConfirmOptions } from "./useDialog";

export type DialogController = {
  /** Shows a dialog with a single action. Resolves when it is closed. */
  alert: (options: DialogAlertOptions) => Promise<void>;
  /** Shows a confirm/cancel dialog. Resolves `true` on confirm, `false` otherwise. */
  confirm: (options: DialogConfirmOptions) => Promise<boolean>;
};

// Lives in its own module so `Dialog` can re-provide it inside the portal
// without importing `useDialog` (which imports `Dialog`).
export const DialogControllerContext = createContext<DialogController | null>(
  null
);
