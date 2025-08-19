import { type ReactNode, useContext, useEffect, useRef } from "react";
import { PortalContext } from "./PortalProvider";

type PortalProps = {
  children: ReactNode;
};

export function Portal({ children }: PortalProps) {
  const { addPortal, updatePortal, removePortal } = useContext(PortalContext);

  const idRef = useRef<string | null>(null);

  useEffect(() => {
    idRef.current = addPortal(children);

    return () => {
      if (idRef.current) removePortal(idRef.current);
    };
  }, []);

  useEffect(() => {
    if (idRef.current) updatePortal(idRef.current, children);
  }, [children, updatePortal]);

  return null;
}
