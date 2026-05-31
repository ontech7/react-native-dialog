import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View, } from "react-native";
import { useDialogStyles } from "./DialogProvider";
import { Portal } from "./components/Portal";
export function Dialog({ open = true, onPressOut, tint = "dark", animation = true, duration = 200, delay = 0, slideFrom = "none", BlurComponent, blurProps, overlayColor, style, children, ...props }) {
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
        }
        else {
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
        const translateValue = slideFrom === "bottom" || slideFrom === "right" ? 30 : -30;
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
    const transparencyBackground = overlayColor ??
        (tint === "dark"
            ? BlurComponent
                ? "#0006"
                : "#0008"
            : BlurComponent
                ? "#fff6"
                : "#fff8");
    const BlurComp = (BlurComponent ?? View);
    // Pin the overlay to the window size instead of StyleSheet.absoluteFill / "100%".
    // Percentage and absolute-fill sizing resolve against the Portal host's parent,
    // whose measured size the New Architecture (RN 0.85+, Expo SDK 56) no longer
    // guarantees — it can collapse to 0, making the backdrop disappear. Explicit
    // window dimensions cover the screen regardless of the ancestor layout.
    const overlay = {
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
    };
    return (React.createElement(Portal, null,
        React.createElement(Animated.View, { style: [overlay, { opacity: progress }], pointerEvents: "none" },
            React.createElement(BlurComp
            /* expo-blur */
            , { 
                /* expo-blur */
                intensity: 25, tint: tint, blurReductionFactor: 8, 
                /* sbaiahmed1/react-native-blur */
                blurAmount: 30, blurType: tint, reducedTransparencyFallbackColor: transparencyBackground, 
                /* @react-native-community/blur */
                downsampleFactor: 8, ...blurProps, style: [StyleSheet.absoluteFill, blurProps?.style] }),
            React.createElement(View, { style: [
                    StyleSheet.absoluteFill,
                    { backgroundColor: transparencyBackground },
                ] })),
        React.createElement(TouchableWithoutFeedback, { onPress: onPressOut },
            React.createElement(View, { style: [overlay, styles.center] },
                React.createElement(Animated.View, { ...props, style: [styles.dialog, dialogAnimStyle, container, style] }, children)))));
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
