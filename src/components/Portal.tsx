import { type ReactNode, useContext, useEffect, useRef } from "react";
import { PortalContext } from "./PortalProvider";

type PortalProps = {
  children: ReactNode;
};

export function Portal({ children }: PortalProps) {
  const host = useContext(PortalContext);

  const idRef = useRef<string | null>(null);

  useEffect(() => {
    if (!host) {
      if (__DEV__) {
        console.warn(
          "[react-native-dialog] <Dialog> must be rendered inside a <DialogProvider>; nothing will be shown."
        );
      }
      return;
    }

    idRef.current = host.addPortal(children);

    return () => {
      if (idRef.current) host.removePortal(idRef.current);
    };
  }, []);

  useEffect(() => {
    if (idRef.current) host?.updatePortal(idRef.current, children);
  }, [children, host]);

  return null;
}
