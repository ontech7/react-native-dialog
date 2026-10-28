import React from "react";

import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { useDialogStyles } from "./theme";

export type DialogFooterProps = ViewProps;

export function DialogFooter({ style, children, ...props }: DialogFooterProps) {
  const { footer } = useDialogStyles();

  return (
    <View {...props} style={[styles.container, footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
