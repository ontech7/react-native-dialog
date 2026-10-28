import React from "react";

import type { StyleProp, TextStyle, TouchableOpacityProps } from "react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  useDialogStyles,
  type DialogActionStyle,
  type DialogActionVariant,
} from "./theme";

export type DialogActionProps = TouchableOpacityProps & {
  /**
   * Visual weight of the action. Omit it for the plain action style; the
   * variant styles come from the theme (`action.variants`), with a sensible
   * fallback when the theme doesn't define them.
   */
  variant?: DialogActionVariant;
  textStyle?: StyleProp<TextStyle>;
  adornmentStart?: React.ReactNode;
  adornmentEnd?: React.ReactNode;
};

export function DialogAction({
  variant,
  adornmentStart,
  adornmentEnd,
  textStyle,
  style,
  disabled,
  children,
  ...props
}: DialogActionProps) {
  const { action } = useDialogStyles();
  const themed = variant ? action?.variants?.[variant] : undefined;
  const fallback = variant && !themed ? variantStyles[variant] : undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      style={[
        styles.button,
        action?.button,
        fallback?.button,
        themed?.button,
        disabled && styles.disabled,
        style,
      ]}
    >
      {adornmentStart}

      <Text
        style={[
          styles.text,
          action?.text,
          fallback?.text,
          themed?.text,
          textStyle,
        ]}
      >
        {children}
      </Text>

      {adornmentEnd}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    maxWidth: "100%",
    padding: 5,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  text: {
    flexShrink: 1,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

// Used when the theme has no `action.variants` entry, so variants still read
// differently with the default (or a custom) theme.
const variantStyles: Record<DialogActionVariant, DialogActionStyle> = {
  primary: { text: { fontWeight: "600" } },
  secondary: { text: { opacity: 0.65 } },
  destructive: { text: { color: "#dc2626", fontWeight: "600" } },
};
