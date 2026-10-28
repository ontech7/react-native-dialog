import React from "react";

import type { TextProps } from "react-native";
import { StyleSheet, Text } from "react-native";
import { useDialogStyles } from "./theme";

export type DialogDescriptionProps = TextProps;

export function DialogDescription({
  children,
  style,
  ...props
}: DialogDescriptionProps) {
  const { description } = useDialogStyles();

  return (
    <Text {...props} style={[styles.text, description, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "400",
  },
});
