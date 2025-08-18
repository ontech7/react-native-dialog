import React from "react";

import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogInputProps = TextInputProps & {
  label?: string;
};

export function DialogInput({ label, style, ...props }: DialogInputProps) {
  const { input } = useDialogStyles();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput {...props} style={[styles.input, input, style]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  inputWrapper: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
