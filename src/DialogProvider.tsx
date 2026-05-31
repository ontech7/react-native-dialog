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
  input?: {
    wrapper?: ViewStyle;
    label?: TextStyle;
    textInput?: TextStyle;
  };
  action?: {
    button?: ViewStyle;
    text?: TextStyle;
  };
};

/**
 * A light/dark pair of styles. Pass it to `DialogProvider` (via `customStyles`)
 * and the active variant is chosen from the device color scheme (or the
 * `colorScheme` override). `dark` falls back to `light` when omitted.
 */
export type DialogStyleTheme = {
  light: DialogStyleConfig;
  dark?: DialogStyleConfig;
};

function isTheme(
  styles: DialogStyleConfig | DialogStyleTheme | undefined
): styles is DialogStyleTheme {
  return !!styles && ("light" in styles || "dark" in styles);
}

const defaultDialogStyles: DialogStyleConfig = {
  container: {},
  header: {},
  body: {},
  footer: {},
  title: {},
  description: {},
  input: {
    wrapper: {},
    textInput: {},
    label: {},
  },
  action: {
    button: {},
    text: {},
  },
};

const DialogStyleContext =
  createContext<DialogStyleConfig>(defaultDialogStyles);

export const useDialogStyles = () => useContext(DialogStyleContext);

export type DialogProviderProps = {
  children: React.ReactNode;
  /**
   * Styles applied in light mode (and the base/fallback). Can also be a
   * `{ light, dark }` theme — e.g. one of the built-in presets (`shadcnStyle`,
   * `materialStyle`) — in which case both variants are read from it.
   */
  customStyles?: DialogStyleConfig | DialogStyleTheme;
  /** Styles applied when the active scheme is dark. Falls back to the light styles when omitted. */
  darkStyles?: DialogStyleConfig;
  /**
   * Active color scheme. Defaults to `"light"` when omitted — pass the device
   * scheme yourself (e.g. from `useColorScheme()`) or your in-app theme value
   * to enable dark mode.
   */
  colorScheme?: "light" | "dark";
};

export function DialogProvider({
  children,
  customStyles,
  darkStyles,
  colorScheme,
}: DialogProviderProps) {
  const scheme = colorScheme ?? "light";

  const light = isTheme(customStyles) ? customStyles.light : customStyles;
  const dark = isTheme(customStyles)
    ? (customStyles.dark ?? darkStyles)
    : darkStyles;

  const active = scheme === "dark" ? (dark ?? light) : light;

  return (
    <DialogStyleContext.Provider
      value={{ ...defaultDialogStyles, ...active }}
    >
      <PortalProvider>{children}</PortalProvider>
    </DialogStyleContext.Provider>
  );
}
