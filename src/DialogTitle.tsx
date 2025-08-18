import React from "react";

import { StyleSheet, Text, View, type TextProps } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogTitleProps = TextProps & {
  adornmentStart?: React.ReactNode;
  adornmentEnd?: React.ReactNode;
};

export function DialogTitle({
  children,
  adornmentStart,
  adornmentEnd,
  style,
  ...props
}: DialogTitleProps) {
  const { title } = useDialogStyles();

  return (
    <View style={styles.container}>
      {adornmentStart}

      <Text {...props} style={[styles.text, title]}>
        {children}
      </Text>

      {adornmentEnd}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 22,
    fontWeight: "600",
  },
});
