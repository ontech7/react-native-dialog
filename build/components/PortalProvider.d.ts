import React from "react";
type PortalContextType = {
    addPortal: (node: React.ReactNode) => string;
    updatePortal: (id: string, node: React.ReactNode) => void;
    removePortal: (id: string) => void;
};
export declare const PortalContext: React.Context<PortalContextType>;
export type PortalProviderProps = {
    children: React.ReactNode;
};
export declare function PortalProvider({ children }: PortalProviderProps): React.JSX.Element;
export {};
