import React from "react";
type PortalContextType = {
    addPortal: (node: React.ReactNode) => string;
    updatePortal: (id: string, node: React.ReactNode) => void;
    removePortal: (id: string) => void;
};
export declare const PortalContext: React.Context<PortalContextType | null>;
type ModalStackContextType = {
    /** Id of the most recently opened dialog still open on this host. */
    top: string | null;
    push: (id: string) => void;
    remove: (id: string) => void;
};
export declare const ModalStackContext: React.Context<ModalStackContextType | null>;
export type PortalProviderProps = {
    children: React.ReactNode;
};
export declare function PortalProvider({ children }: PortalProviderProps): React.JSX.Element;
export {};
