import React, { useEffect, useState } from "react";
import { Portal } from "@gorhom/portal";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming, } from "react-native-reanimated";
import { useDialogStyles } from "./DialogProvider";
export function Dialog({ open, tint = "dark", duration = 200, slideFrom = "none", style, children, ...props }) {
    const { container } = useDialogStyles();
    const [mounted, setMounted] = useState(open);
    const progress = useSharedValue(open ? 1 : 0);
    const dialogAnimStyle = useAnimatedStyle(() => {
        if (slideFrom === "none") {
            return { opacity: progress.value };
        }
        const translateValue = slideFrom === "bottom" || slideFrom === "right" ? 30 : -30;
        return {
            opacity: progress.value,
            transform: [
                slideFrom === "top" || slideFrom === "bottom"
                    ? {
                        translateY: interpolate(progress.value, [0, 1], [translateValue, 0]),
                    }
                    : {
                        translateX: interpolate(progress.value, [0, 1], [translateValue, 0]),
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
        }
        else {
            progress.value = withTiming(0, { duration, easing: Easing.in(Easing.ease) }, (finished) => {
                if (finished) {
                    runOnJS(setMounted)(false);
                }
            });
        }
    }, [open]);
    if (!mounted) {
        return null;
    }
    return (React.createElement(Portal, null,
        React.createElement(BlurView, { blurReductionFactor: 12, intensity: 30, experimentalBlurMethod: "dimezisBlurView", tint: tint, style: StyleSheet.absoluteFillObject }),
        React.createElement(Animated.View, { style: [
                StyleSheet.absoluteFillObject,
                { backgroundColor: tint === "dark" ? "#0003" : "#fff3" },
                blurAnimStyle,
            ] }),
        React.createElement(View, { style: styles.container },
            React.createElement(Animated.View, { ...props, style: [styles.dialog, dialogAnimStyle, container, style] }, children))));
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
