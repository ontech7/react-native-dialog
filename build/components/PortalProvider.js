import React, { createContext, useCallback, useMemo, useRef, useState, } from "react";
import { PortalItem } from "./PortalItem";
export const PortalContext = createContext({
    addPortal: () => "",
    updatePortal: () => { },
    removePortal: () => { },
});
let NEXT_ID = 0;
const genId = () => String(++NEXT_ID);
export function PortalProvider({ children }) {
    const [entries, setEntries] = useState([]);
    const itemRefs = useRef(new Map());
    const addPortal = useCallback((node) => {
        const id = genId();
        setEntries((prev) => [...prev, { id, initial: node }]);
        return id;
    }, []);
    const updatePortal = useCallback((id, node) => {
        const ref = itemRefs.current.get(id);
        ref?.current?.update(node);
    }, []);
    const removePortal = useCallback((id) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        itemRefs.current.delete(id);
    }, []);
    const ctx = useMemo(() => ({ addPortal, updatePortal, removePortal }), [addPortal, updatePortal, removePortal]);
    return (React.createElement(PortalContext.Provider, { value: ctx },
        children,
        entries.map(({ id, initial }) => {
            let ref = itemRefs.current.get(id);
            if (!ref) {
                ref = React.createRef();
                itemRefs.current.set(id, ref);
            }
            return React.createElement(PortalItem, { key: id, ref: ref, initial: initial });
        })));
}
