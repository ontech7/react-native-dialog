import React, { createContext, useCallback, useContext, useMemo, useRef, useState, } from "react";
import { PortalItem } from "./PortalItem";
// `null` means "no host above": the root `DialogProvider` creates one.
export const PortalContext = createContext(null);
function createModalStack() {
    let ids = [];
    const listeners = new Set();
    const notify = () => listeners.forEach((listener) => listener());
    return {
        push: (id) => {
            ids = [...ids.filter((e) => e !== id), id];
            notify();
        },
        remove: (id) => {
            ids = ids.filter((e) => e !== id);
            notify();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        indexOf: (id) => ids.indexOf(id),
        isTop: (id) => ids[ids.length - 1] === id,
    };
}
// A store rather than state: dialogs read their own position with
// `useSyncExternalStore`, so opening one doesn't re-render all the others.
export const ModalStackContext = createContext(null);
let NEXT_ID = 0;
const genId = () => String(++NEXT_ID);
export function PortalProvider({ children }) {
    const [entries, setEntries] = useState([]);
    const parentStack = useContext(ModalStackContext);
    const ownStack = useRef(null);
    if (!parentStack && !ownStack.current) {
        ownStack.current = createModalStack();
    }
    const modalStack = parentStack ?? ownStack.current;
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
        React.createElement(ModalStackContext.Provider, { value: modalStack },
            children,
            entries.map(({ id, initial }) => {
                let ref = itemRefs.current.get(id);
                if (!ref) {
                    ref = React.createRef();
                    itemRefs.current.set(id, ref);
                }
                return React.createElement(PortalItem, { key: id, ref: ref, initial: initial });
            }))));
}
