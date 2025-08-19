import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, TouchableWithoutFeedback, View, } from "react-native";
import { useDialogStyles } from "./DialogProvider";
import { Portal } from "./components/Portal";
export function Dialog({ open, onPressOut, tint = "dark", animation = true, duration = 200, slideFrom = "none", BlurComponent, style, children, ...props }) {
    const { container } = useDialogStyles();
    const [mounted, setMounted] = useState(open);
    const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
    useEffect(() => {
        if (!animation) {
            setMounted(open);
            return;
        }
        if (open) {
            setMounted(true);
            Animated.timing(progress, {
                toValue: 1,
                duration,
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
    const transparencyBackground = tint === "dark"
        ? BlurComponent
            ? "#0003"
            : "#0008"
        : BlurComponent
            ? "#fff3"
            : "#fff8";
    const BlurComp = (BlurComponent ?? View);
    return (React.createElement(Portal, null,
        React.createElement(BlurComp
        /* expo-blur */
        , { 
            /* expo-blur */
            intensity: 25, tint: tint, experimentalBlurMethod: "dimezisBlurView", blurReducedFactor: 8, 
            /* sbaiahmed1/react-native-blur */
            blurAmount: 30, blurType: tint, reducedTransparencyFallbackColor: transparencyBackground, 
            /* @react-native-community/blur */
            downsampleFactor: 8, style: StyleSheet.absoluteFillObject }),
        React.createElement(Animated.View, { style: [
                StyleSheet.absoluteFillObject,
                { backgroundColor: transparencyBackground },
                { opacity: progress },
            ] }),
        React.createElement(TouchableWithoutFeedback, { onPress: onPressOut },
            React.createElement(View, { style: styles.container },
                React.createElement(Animated.View, { ...props, style: [styles.dialog, dialogAnimStyle, container, style] }, children)))));
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
