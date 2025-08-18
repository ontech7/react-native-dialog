import React from "react";

import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogHeaderProps = ViewProps;

export function DialogHeader({ style, children, ...props }: DialogHeaderProps) {
  const { header } = useDialogStyles();

  return (
    <View {...props} style={[styles.container, header, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 6,
  },
});
