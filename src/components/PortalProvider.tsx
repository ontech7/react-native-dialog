import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { PortalItem, PortalItemHandle } from "./PortalItem";

type PortalEntry = {
  id: string;
  initial: React.ReactNode;
};

type PortalContextType = {
  addPortal: (node: React.ReactNode) => string;
  updatePortal: (id: string, node: React.ReactNode) => void;
  removePortal: (id: string) => void;
};

// `null` means "no host above": the root `DialogProvider` creates one.
export const PortalContext = createContext<PortalContextType | null>(null);

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

function createModalStack(): ModalStack {
  let ids: string[] = [];
  const listeners = new Set<() => void>();
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
export const ModalStackContext = createContext<ModalStack | null>(null);

let NEXT_ID = 0;
const genId = () => String(++NEXT_ID);

export type PortalProviderProps = {
  children: React.ReactNode;
};

export function PortalProvider({ children }: PortalProviderProps) {
  const [entries, setEntries] = useState<PortalEntry[]>([]);

  const parentStack = useContext(ModalStackContext);
  const ownStack = useRef<ModalStack | null>(null);
  if (!parentStack && !ownStack.current) {
    ownStack.current = createModalStack();
  }
  const modalStack = parentStack ?? ownStack.current!;

  const itemRefs = useRef(
    new Map<string, React.RefObject<PortalItemHandle | null>>()
  );

  const addPortal = useCallback((node: React.ReactNode) => {
    const id = genId();
    setEntries((prev) => [...prev, { id, initial: node }]);
    return id;
  }, []);

  const updatePortal = useCallback((id: string, node: React.ReactNode) => {
    const ref = itemRefs.current.get(id);
    ref?.current?.update(node);
  }, []);

  const removePortal = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    itemRefs.current.delete(id);
  }, []);

  const ctx = useMemo(
    () => ({ addPortal, updatePortal, removePortal }),
    [addPortal, updatePortal, removePortal]
  );

  return (
    <PortalContext.Provider value={ctx}>
      <ModalStackContext.Provider value={modalStack}>
        {children}

        {entries.map(({ id, initial }) => {
          let ref = itemRefs.current.get(id);

          if (!ref) {
            ref = React.createRef<PortalItemHandle>();
            itemRefs.current.set(id, ref);
          }

          return <PortalItem key={id} ref={ref} initial={initial} />;
        })}
      </ModalStackContext.Provider>
    </PortalContext.Provider>
  );
}
