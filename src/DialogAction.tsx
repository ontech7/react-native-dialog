import React from "react";

import type { TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogActionProps = TouchableOpacityProps & {
  style?: ViewStyle;
  textStyle?: TextStyle;
  adornmentStart?: React.ReactNode;
  adornmentEnd?: React.ReactNode;
};

export function DialogAction({
  adornmentStart,
  adornmentEnd,
  textStyle,
  style,
  children,
  ...props
}: DialogActionProps) {
  const { action } = useDialogStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
      style={[styles.button, action?.button, style]}
    >
      {adornmentStart}

      <Text style={[styles.text, action?.text, textStyle]}>{children}</Text>

      {adornmentEnd}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 16,
  },
});
