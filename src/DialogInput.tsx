import React from "react";

import type { TextInputProps, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogInputProps = TextInputProps & {
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
};

export function DialogInput({
  label,
  style,
  containerStyle,
  labelStyle,
  ...props
}: DialogInputProps) {
  const { input } = useDialogStyles();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View style={[styles.inputWrapper, containerStyle]}>
        <TextInput
          cursorColor="#000"
          placeholderTextColor="#777"
          {...props}
          style={[styles.input, input, style]}
        />
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
    color: "#000",
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
