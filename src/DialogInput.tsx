import React from "react";

import type { TextInputProps, TextStyle, ViewStyle } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogInputProps = TextInputProps & {
  label?: string;
  wrapperStyle?: ViewStyle;
  labelStyle?: TextStyle;
};

export function DialogInput({
  label,
  style,
  wrapperStyle,
  labelStyle,
  ...props
}: DialogInputProps) {
  const { input } = useDialogStyles();

  // Default the cursor to the themed text color so it stays visible in dark
  // mode; an explicit `cursorColor` prop still wins (spread after).
  const themedColor = input?.textInput?.color as string | undefined;

  return (
    <View style={[styles.wrapper, input?.wrapper, wrapperStyle]}>
      {label && (
        <Text style={[styles.label, input?.label, labelStyle]}>{label}</Text>
      )}

      <TextInput
        cursorColor={themedColor ?? "#000"}
        placeholderTextColor="#777"
        {...props}
        style={[styles.input, input?.textInput, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 36,
    color: "#000",
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
