import { useContext, useEffect, useRef } from "react";
import { PortalContext } from "./PortalProvider";
export function Portal({ children }) {
    const { addPortal, updatePortal, removePortal } = useContext(PortalContext);
    const idRef = useRef(null);
    useEffect(() => {
        idRef.current = addPortal(children);
        return () => {
            if (idRef.current)
                removePortal(idRef.current);
        };
    }, []);
    useEffect(() => {
        if (idRef.current)
            updatePortal(idRef.current, children);
    }, [children, updatePortal]);
    return null;
}
