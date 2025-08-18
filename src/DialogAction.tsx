import React from "react";

import type { TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDialogStyles } from "./DialogProvider";

export type DialogActionProps = TouchableOpacityProps & {
  style?: ViewStyle & Pick<TextStyle, "color" | "fontSize" | "fontWeight">;
  adornmentStart?: React.ReactNode;
  adornmentEnd?: React.ReactNode;
};

export function DialogAction({
  adornmentStart,
  adornmentEnd,
  style,
  children,
  ...props
}: DialogActionProps) {
  const { action } = useDialogStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...props}
      style={[styles.container, action, style]}
    >
      {adornmentStart}

      <Text
        style={[
          styles.text,
          (style?.color !== undefined || action?.color !== undefined) && {
            color: style?.color || action?.color,
          },
          (style?.fontSize !== undefined || action?.fontSize !== undefined) && {
            fontSize: style?.fontSize || action?.fontSize,
          },
          (style?.fontWeight !== undefined ||
            action?.fontWeight !== undefined) && {
            fontWeight: style?.fontWeight || action?.fontWeight,
          },
        ]}
      >
        {children}
      </Text>

      {adornmentEnd}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
