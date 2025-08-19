import React, {
  createContext,
  useCallback,
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

export const PortalContext = createContext<PortalContextType>({
  addPortal: () => "",
  updatePortal: () => {},
  removePortal: () => {},
});

let NEXT_ID = 0;
const genId = () => String(++NEXT_ID);

export type PortalProviderProps = {
  children: React.ReactNode;
};

export function PortalProvider({ children }: PortalProviderProps) {
  const [entries, setEntries] = useState<PortalEntry[]>([]);

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
      {children}

      {entries.map(({ id, initial }) => {
        let ref = itemRefs.current.get(id);

        if (!ref) {
          ref = React.createRef<PortalItemHandle>();
          itemRefs.current.set(id, ref);
        }

        return <PortalItem key={id} ref={ref} initial={initial} />;
      })}
    </PortalContext.Provider>
  );
}
