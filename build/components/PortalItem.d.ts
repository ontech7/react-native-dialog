import React from "react";
export type PortalItemHandle = {
    update: (node: React.ReactNode) => void;
};
export declare const PortalItem: React.ForwardRefExoticComponent<{
    initial: React.ReactNode;
} & React.RefAttributes<PortalItemHandle>>;
