import React from "react";
type PortalContextType = {
    addPortal: (node: React.ReactNode) => string;
    updatePortal: (id: string, node: React.ReactNode) => void;
    removePortal: (id: string) => void;
};
export declare const PortalContext: React.Context<PortalContextType | null>;
/**
 * Open dialogs, oldest first. Shared by every host in the app (nested hosts
 * reuse the root's), so there's a single "topmost" dialog: only it is modal
 * for screen readers (sibling overlays that are all `accessibilityViewIsModal`
 * would hide each other), and overlays are layered in this order.
 */
export type ModalStack = {
    push: (id: string) => void;
    remove: (id: string) => void;
    subscribe: (listener: () => void) => () => void;
    indexOf: (id: string) => number;
    isTop: (id: string) => boolean;
};
export declare const ModalStackContext: React.Context<ModalStack | null>;
export type PortalProviderProps = {
    children: React.ReactNode;
};
export declare function PortalProvider({ children }: PortalProviderProps): React.JSX.Element;
export {};
