import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native";
import { useDialogStyles } from "./DialogProvider";
import { Portal } from "./components/Portal";

export type DialogProps = ViewProps & {
  open?: boolean;
  onPressOut?: () => Promise<void> | void;
  tint?: "light" | "dark";
  animation?: boolean;
  duration?: number;
  delay?: number;
  slideFrom?: "top" | "bottom" | "left" | "right" | "center" | "none";
  BlurComponent?: React.ComponentType<any>;
  /**
   * Extra props forwarded to `BlurComponent`, overriding the defaults. Use this
   * to configure your blur library per SDK — e.g. on Expo SDK 56 expo-blur the
   * Android native blur is `blurProps={{ blurMethod: "dimezisBlurView", blurTarget }}`,
   * while on older SDKs it was `blurProps={{ experimentalBlurMethod: "dimezisBlurView" }}`.
   */
  blurProps?: Record<string, any>;
  /**
   * Color of the scrim painted over the backdrop (on top of the blur, if any).
   * Defaults are derived from `tint`; pass this to force a specific scrim — e.g.
   * a darker overlay behind a blurred dialog (`overlayColor="rgba(0,0,0,0.5)"`).
   */
  overlayColor?: string;
};

export function Dialog({
  open = true,
  onPressOut,
  tint = "dark",
  animation = true,
  duration = 200,
  delay = 0,
  slideFrom = "none",
  BlurComponent,
  blurProps,
  overlayColor,
  style,
  children,
  ...props
}: DialogProps) {
  const { container } = useDialogStyles();
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(open);

  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (!animation) {
      progress.setValue(open ? 1 : 0);
      setMounted(open);
      return;
    }

    if (open) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [open]);

  const dialogAnimStyle = (() => {
    if (!animation) {
      return { opacity: open ? 1 : 0 };
    }

    if (slideFrom === "none") {
      return { opacity: progress };
    }

    if (slideFrom === "center") {
      const scale = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
      });

      return {
        opacity: progress,
        transform: [{ scale }],
      };
    }

    const translateValue =
      slideFrom === "bottom" || slideFrom === "right" ? 30 : -30;

    const translate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [translateValue, 0],
    });

    return {
      opacity: progress,
      transform: [
        slideFrom === "top" || slideFrom === "bottom"
          ? { translateY: translate }
          : { translateX: translate },
      ],
    };
  })();

  if (!mounted) {
    return null;
  }

  // Scrim painted over the backdrop (and over the blur, if any). With a blur the
  // default is a lighter veil so the blur stays visible, but still dark/light
  // enough to set the dialog apart. Override with `overlayColor` for full control.
  const transparencyBackground =
    overlayColor ??
    (tint === "dark"
      ? BlurComponent
        ? "#0006"
        : "#0008"
      : BlurComponent
      ? "#fff6"
      : "#fff8");

  const BlurComp = (BlurComponent ?? View) as React.ComponentType<any>;

  // Pin the overlay to the window size instead of StyleSheet.absoluteFill / "100%".
  // Percentage and absolute-fill sizing resolve against the Portal host's parent,
  // whose measured size the New Architecture (RN 0.85+, Expo SDK 56) no longer
  // guarantees — it can collapse to 0, making the backdrop disappear. Explicit
  // window dimensions cover the screen regardless of the ancestor layout.
  const overlay = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width,
    height,
  };

  return (
    <Portal>
      {/* Backdrop (blur + dim) fades in/out with `progress` so the blur ramps up
          gradually instead of popping in. `pointerEvents="none"` lets the taps
          fall through to the dismiss layer below. */}
      <Animated.View style={[overlay, { opacity: progress }]} pointerEvents="none">
        <BlurComp
          /* expo-blur */
          intensity={25}
          tint={tint}
          blurReductionFactor={8}
          /* sbaiahmed1/react-native-blur */
          blurAmount={30}
          blurType={tint}
          reducedTransparencyFallbackColor={transparencyBackground}
          /* @react-native-community/blur */
          downsampleFactor={8}
          /* Consumer overrides (e.g. expo-blur SDK 56 `blurMethod` + `blurTarget`) */
          {...blurProps}
          style={[StyleSheet.absoluteFill, blurProps?.style]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: transparencyBackground },
          ]}
        />
      </Animated.View>
      <TouchableWithoutFeedback onPress={onPressOut}>
        <View style={[overlay, styles.center]}>
          <Animated.View
            {...props}
            style={[styles.dialog, dialogAnimStyle, container, style]}
          >
            {children}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Portal>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  dialog: {
    maxWidth: "80%",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});
