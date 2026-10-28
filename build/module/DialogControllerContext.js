import { createContext } from "react";
// Lives in its own module so `Dialog` can re-provide it inside the portal
// without importing `useDialog` (which imports `Dialog`).
export const DialogControllerContext = createContext(null);
