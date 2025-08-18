import { PortalProvider } from "@gorhom/portal";
import React, { createContext, useContext } from "react";

import type { TextStyle, ViewStyle } from "react-native";

export type DialogStyleConfig = {
  container?: ViewStyle;
  header?: ViewStyle;
  body?: ViewStyle;
  footer?: ViewStyle;
  title?: TextStyle;
  description?: TextStyle;
  input?: TextStyle;
  action?: ViewStyle & Pick<TextStyle, "color" | "fontSize" | "fontWeight">;
};

const defaultDialogStyles: DialogStyleConfig = {
  container: {},
  header: {},
  body: {},
  footer: {},
  title: {},
  description: {},
  input: {},
  action: {},
};

const DialogStyleContext =
  createContext<DialogStyleConfig>(defaultDialogStyles);

export const useDialogStyles = () => useContext(DialogStyleContext);

export type DialogProviderProps = {
  children: React.ReactNode;
  styles?: DialogStyleConfig;
};

export function DialogProvider({ children, styles }: DialogProviderProps) {
  return (
    <DialogStyleContext.Provider value={{ ...defaultDialogStyles, ...styles }}>
      <PortalProvider>{children}</PortalProvider>
    </DialogStyleContext.Provider>
  );
}
