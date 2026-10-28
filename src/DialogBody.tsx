import React from "react";

import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useDialogStyles } from "./theme";

export type DialogBodyProps = ViewProps & {
  /**
   * Render the content in a `ScrollView` that shrinks to fit the dialog's max
   * height, so long content scrolls while the header and footer stay visible.
   */
  scrollable?: boolean;
  /** Extra props for the `ScrollView` used when `scrollable` is set. */
  scrollViewProps?: Omit<ScrollViewProps, "style" | "contentContainerStyle">;
};

export function DialogBody({
  children,
  style,
  scrollable = false,
  scrollViewProps,
  ...props
}: DialogBodyProps) {
  const { body } = useDialogStyles();

  if (scrollable) {
    // Vertical padding stays fixed around the scroll area, so scrolled content
    // is clipped at a gap below the header instead of right against it.
    const {
      padding,
      paddingVertical,
      paddingTop,
      paddingBottom,
      paddingHorizontal,
      ...contentStyle
    }: ViewStyle = StyleSheet.flatten([styles.container, body, style]) ?? {};

    return (
      <View
        style={[
          styles.scrollFrame,
          {
            paddingTop: paddingTop ?? paddingVertical ?? padding,
            paddingBottom: paddingBottom ?? paddingVertical ?? padding,
          },
        ]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          {...props}
          {...scrollViewProps}
          style={styles.scroll}
          contentContainerStyle={[
            contentStyle,
            { paddingHorizontal: paddingHorizontal ?? padding },
          ]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

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
  scrollFrame: {
    flexShrink: 1,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
});
