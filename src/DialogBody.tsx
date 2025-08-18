import React from "react";

import { StyleSheet, View, ViewProps } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogBodyProps = ViewProps;

export function DialogBody({ children, style, ...props }: DialogBodyProps) {
  const { body } = useDialogStyles();

  return (
    <View {...props} style={[styles.container, body, style]}>
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
