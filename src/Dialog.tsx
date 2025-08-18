import React, { useEffect, useState } from "react";

import { Portal } from "@gorhom/portal";
import { BlurView } from "expo-blur";
import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDialogStyles } from "./DialogProvider";

export type DialogProps = ViewProps & {
  open: boolean;
  tint?: "light" | "dark";
  duration?: number;
  slideFrom?: "top" | "bottom" | "left" | "right" | "none";
};

export function Dialog({
  open,
  tint = "dark",
  duration = 200,
  slideFrom = "none",
  style,
  children,
  ...props
}: DialogProps) {
  const { container } = useDialogStyles();

  const [mounted, setMounted] = useState(open);

  const progress = useSharedValue(open ? 1 : 0);

  const dialogAnimStyle = useAnimatedStyle(() => {
    if (slideFrom === "none") {
      return { opacity: progress.value };
    }

    const translateValue =
      slideFrom === "bottom" || slideFrom === "right" ? 30 : -30;

    return {
      opacity: progress.value,
      transform: [
        slideFrom === "top" || slideFrom === "bottom"
          ? {
              translateY: interpolate(
                progress.value,
                [0, 1],
                [translateValue, 0]
              ),
            }
          : {
              translateX: interpolate(
                progress.value,
                [0, 1],
                [translateValue, 0]
              ),
            },
      ],
    };
  });

  const blurAnimStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  useEffect(() => {
    if (open) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration, easing: Easing.in(Easing.ease) },
        (finished) => {
          if (finished) {
            runOnJS(setMounted)(false);
          }
        }
      );
    }
  }, [open]);

  if (!mounted) {
    return null;
  }

  return (
    <Portal>
      <BlurView
        blurReductionFactor={12}
        intensity={30}
        experimentalBlurMethod="dimezisBlurView"
        tint={tint}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: tint === "dark" ? "#0003" : "#fff3" },
          blurAnimStyle,
        ]}
      />
      <View style={styles.container}>
        <Animated.View
          {...props}
          style={[styles.dialog, dialogAnimStyle, container, style]}
        >
          {children}
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1000,
  },
  dialog: {
    maxWidth: "80%",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});
