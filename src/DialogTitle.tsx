import React from "react";

import { StyleSheet, Text, View, type TextProps } from "react-native";
import { useDialogStyles } from "./theme";

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

      <Text
        accessibilityRole="header"
        {...props}
        style={[styles.text, title, style]}
      >
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
