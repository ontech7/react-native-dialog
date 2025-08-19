import React, { createContext, useContext } from "react";

import type { TextStyle, ViewStyle } from "react-native";
import { PortalProvider } from "./components/PortalProvider";

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
  customStyles?: DialogStyleConfig;
};

export function DialogProvider({
  children,
  customStyles,
}: DialogProviderProps) {
  return (
    <DialogStyleContext.Provider
      value={{ ...defaultDialogStyles, ...customStyles }}
    >
      <PortalProvider>{children}</PortalProvider>
    </DialogStyleContext.Provider>
  );
}
