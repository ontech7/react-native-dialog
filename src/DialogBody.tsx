import React, { useContext, useLayoutEffect } from "react";

import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { DialogLayoutContext } from "./DialogLayoutContext";
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
  const layout = useContext(DialogLayoutContext);

  // Before paint, so the dialog is capped from its first frame.
  useLayoutEffect(
    () => (scrollable ? layout?.registerScrollable() : undefined),
    [scrollable, layout]
  );

  if (scrollable) {
    const { box, content } = splitScrollableStyle(
      StyleSheet.flatten([styles.container, body, style]) ?? {}
    );

    return (
      <View {...props} style={[styles.scrollFrame, box]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
          style={styles.scroll}
          contentContainerStyle={content}
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

// Styles that lay out the content go on the scrolling content; everything else
// (background, border, margin, vertical padding…) stays on the body box, as for
// a plain body. The vertical padding staying put means scrolled content is
// clipped at a gap below the header instead of right against it.
const CONTENT_STYLE_KEYS = new Set([
  "paddingHorizontal",
  "paddingLeft",
  "paddingRight",
  "paddingStart",
  "paddingEnd",
  "gap",
  "rowGap",
  "columnGap",
  "flexDirection",
  "flexWrap",
  "alignItems",
  "alignContent",
  "justifyContent",
]);

function splitScrollableStyle(style: ViewStyle) {
  const box: Record<string, unknown> = {};
  const content: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(style)) {
    (CONTENT_STYLE_KEYS.has(key) ? content : box)[key] = value;
  }

  // `padding` covers both sides: vertical on the box, horizontal on the content.
  if (style.padding != null) {
    delete box.padding;
    box.paddingTop = style.paddingTop ?? style.paddingVertical ?? style.padding;
    box.paddingBottom =
      style.paddingBottom ?? style.paddingVertical ?? style.padding;
    content.paddingHorizontal = style.paddingHorizontal ?? style.padding;
  }

  return { box: box as ViewStyle, content: content as ViewStyle };
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
