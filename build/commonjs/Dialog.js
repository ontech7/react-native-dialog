"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialog = Dialog;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const DialogControllerContext_1 = require("./DialogControllerContext");
const DialogLayoutContext_1 = require("./DialogLayoutContext");
const theme_1 = require("./theme");
const Portal_1 = require("./components/Portal");
const PortalProvider_1 = require("./components/PortalProvider");
/** Space kept free above and below the dialog when it hits its max height. */
const VERTICAL_MARGIN = 64;
/** Same, while the keyboard is up: tighter, so a form still fits on small phones. */
const KEYBOARD_VERTICAL_MARGIN = 16;
function Dialog({ open = true, onRequestClose, onPressOut, onShow, onDismiss, avoidKeyboard = true, tint = "dark", animation = true, duration = 200, delay = 0, slideFrom = "none", BlurComponent, blurProps, overlayColor, style, children, testID, pointerEvents, ...props }) {
    const dialogStyles = (0, theme_1.useDialogStyles)();
    const controller = (0, react_1.useContext)(DialogControllerContext_1.DialogControllerContext);
    const modalStack = (0, react_1.useContext)(PortalProvider_1.ModalStackContext);
    const dialogId = (0, react_1.useId)();
    const { width, height } = (0, react_native_1.useWindowDimensions)();
    const [mounted, setMounted] = (0, react_1.useState)(open);
    const reduceMotion = useReduceMotion();
    const keyboardHeight = useKeyboardHeight(avoidKeyboard && mounted);
    const progress = (0, react_1.useRef)(new react_native_1.Animated.Value(open ? 1 : 0)).current;
    // Latest callbacks, so effects don't re-run (or re-register the back
    // handler, losing its priority) when inline functions change every render.
    const callbacks = (0, react_1.useRef)({ onRequestClose, onPressOut, onShow, onDismiss });
    (0, react_1.useEffect)(() => {
        callbacks.current = { onRequestClose, onPressOut, onShow, onDismiss };
    });
    const wasOpen = (0, react_1.useRef)(open);
    (0, react_1.useEffect)(() => {
        const closing = wasOpen.current && !open;
        wasOpen.current = open;
        if (!animation) {
            progress.setValue(open ? 1 : 0);
            setMounted(open);
            if (open)
                callbacks.current.onShow?.();
            else if (closing)
                callbacks.current.onDismiss?.();
            return;
        }
        if (open) {
            setMounted(true);
            react_native_1.Animated.timing(progress, {
                toValue: 1,
                duration,
                delay,
                easing: react_native_1.Easing.out(react_native_1.Easing.ease),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    callbacks.current.onShow?.();
                }
            });
        }
        else {
            react_native_1.Animated.timing(progress, {
                toValue: 0,
                duration,
                easing: react_native_1.Easing.in(react_native_1.Easing.ease),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setMounted(false);
                    if (closing)
                        callbacks.current.onDismiss?.();
                }
            });
        }
    }, [open]);
    (0, react_1.useEffect)(() => {
        if (!open)
            return;
        // Registered once per opening, last = called first, so the topmost dialog
        // handles the press. Always consumed: an open dialog is modal, so the
        // press must not reach (and e.g. pop) the screen behind it, even when the
        // dialog can't be dismissed.
        const subscription = react_native_1.BackHandler.addEventListener("hardwareBackPress", () => {
            const { onRequestClose, onPressOut } = callbacks.current;
            (onRequestClose ?? onPressOut)?.();
            return true;
        });
        return () => subscription.remove();
    }, [open]);
    const pushModal = modalStack?.push;
    const removeModal = modalStack?.remove;
    (0, react_1.useEffect)(() => {
        if (!open || !pushModal || !removeModal)
            return;
        pushModal(dialogId);
        return () => removeModal(dialogId);
    }, [open, pushModal, removeModal]);
    const isTopmost = !modalStack || modalStack.top === dialogId;
    const dialogAnimStyle = (() => {
        if (!animation) {
            return { opacity: open ? 1 : 0 };
        }
        if (slideFrom === "none" || reduceMotion) {
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
    // Taps are ignored while the close animation runs, so a double tap can't
    // trigger an action twice or dismiss twice. `onPressOut` is only a fallback,
    // so passing both doesn't close twice.
    const requestClose = open
        ? () => {
            const { onRequestClose, onPressOut } = callbacks.current;
            (onRequestClose ?? onPressOut)?.();
        }
        : undefined;
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
    const BlurComp = (BlurComponent ?? react_native_1.View);
    // Pin the overlay to the window size instead of StyleSheet.absoluteFill / "100%".
    // Percentage and absolute-fill sizing resolve against the Portal host's parent,
    // whose measured size the New Architecture (RN 0.85+, Expo SDK 56) no longer
    // guarantees — it can collapse to 0, making the backdrop disappear. Explicit
    // window dimensions cover the screen regardless of the ancestor layout; the
    // layers inside can then safely fill this overlay.
    const overlay = {
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
    };
    const margin = keyboardHeight > 0 ? KEYBOARD_VERTICAL_MARGIN : VERTICAL_MARGIN;
    const maxHeight = Math.max(0, height - keyboardHeight - 2 * margin);
    return (react_1.default.createElement(Portal_1.Portal, null,
        react_1.default.createElement(theme_1.DialogStyleContext.Provider, { value: dialogStyles },
            react_1.default.createElement(DialogControllerContext_1.DialogControllerContext.Provider, { value: controller },
                react_1.default.createElement(react_native_1.View, { style: [overlay, styles.overlay], accessibilityViewIsModal: isTopmost, onAccessibilityEscape: requestClose },
                    react_1.default.createElement(react_native_1.Animated.View, { style: [react_native_1.StyleSheet.absoluteFill, { opacity: progress }], pointerEvents: "none" },
                        react_1.default.createElement(BlurComp
                        /* expo-blur */
                        , { 
                            /* expo-blur */
                            intensity: 25, tint: tint, blurReductionFactor: 8, 
                            /* sbaiahmed1/react-native-blur */
                            blurAmount: 30, blurType: tint, reducedTransparencyFallbackColor: transparencyBackground, 
                            /* @react-native-community/blur */
                            downsampleFactor: 8, ...blurProps, style: [react_native_1.StyleSheet.absoluteFill, blurProps?.style] }),
                        react_1.default.createElement(react_native_1.View, { style: [
                                react_native_1.StyleSheet.absoluteFill,
                                { backgroundColor: transparencyBackground },
                            ] })),
                    react_1.default.createElement(react_native_1.Pressable, { testID: testID ? `${testID}-backdrop` : undefined, style: react_native_1.StyleSheet.absoluteFill, onPress: requestClose, accessible: false, importantForAccessibility: "no" }),
                    react_1.default.createElement(react_native_1.View, { style: [
                            react_native_1.StyleSheet.absoluteFill,
                            styles.center,
                            { paddingBottom: keyboardHeight },
                        ], pointerEvents: "box-none" },
                        react_1.default.createElement(DialogPanel, { ...props, testID: testID, pointerEvents: open ? pointerEvents : "none", maxHeight: maxHeight, style: [dialogAnimStyle, dialogStyles.container, style] }, children)))))));
}
/**
 * The dialog box. Rendered inside the portal, so a scrollable `DialogBody`
 * can turn the height cap on without a round trip through the portal.
 */
function DialogPanel({ maxHeight, style, children, ...props }) {
    const [scrollables, setScrollables] = (0, react_1.useState)(0);
    const layout = (0, react_1.useMemo)(() => ({
        registerScrollable: () => {
            setScrollables((count) => count + 1);
            return () => setScrollables((count) => count - 1);
        },
    }), []);
    return (react_1.default.createElement(DialogLayoutContext_1.DialogLayoutContext.Provider, { value: layout },
        react_1.default.createElement(react_native_1.Animated.View, { ...props, style: [styles.dialog, scrollables > 0 && { maxHeight }, style] }, children)));
}
// One OS subscription shared by every dialog, active while at least one is
// mounted (a list can render a closed dialog per row).
const reduceMotionStore = (() => {
    let reduceMotion = false;
    let subscription;
    const listeners = new Set();
    const set = (enabled) => {
        if (enabled === reduceMotion)
            return;
        reduceMotion = enabled;
        listeners.forEach((listener) => listener());
    };
    return {
        get: () => reduceMotion,
        subscribe: (listener) => {
            listeners.add(listener);
            if (listeners.size === 1) {
                react_native_1.AccessibilityInfo.isReduceMotionEnabled()
                    .then(set)
                    .catch(() => { });
                subscription = react_native_1.AccessibilityInfo.addEventListener("reduceMotionChanged", set);
            }
            return () => {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    subscription?.remove();
                    subscription = undefined;
                }
            };
        },
    };
})();
function useReduceMotion() {
    return (0, react_1.useSyncExternalStore)(reduceMotionStore.subscribe, reduceMotionStore.get);
}
/** Height of the software keyboard while `enabled`, 0 otherwise. */
function useKeyboardHeight(enabled) {
    const [keyboardHeight, setKeyboardHeight] = (0, react_1.useState)(0);
    const current = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        const set = (next) => {
            current.current = next;
            setKeyboardHeight(next);
        };
        if (!enabled) {
            set(0);
            return;
        }
        // The keyboard may already be up when the dialog opens.
        set(react_native_1.Keyboard.metrics?.()?.height ?? 0);
        const update = (event, next) => {
            // Focus moving between inputs re-fires the show event with the same
            // height: animating then would animate the next unrelated layout change.
            if (next === current.current)
                return;
            if (event?.duration) {
                react_native_1.LayoutAnimation.configureNext({
                    duration: event.duration,
                    update: {
                        duration: event.duration,
                        type: react_native_1.LayoutAnimation.Types[event.easing] ?? "keyboard",
                    },
                });
            }
            set(next);
        };
        const onShow = (event) => update(event, event.endCoordinates.height);
        const onHide = (event) => update(event, 0);
        const subscriptions = [
            react_native_1.Keyboard.addListener("keyboardDidShow", (event) => update(undefined, event.endCoordinates.height)),
            react_native_1.Keyboard.addListener("keyboardDidHide", () => update(undefined, 0)),
        ];
        // iOS also reports the keyboard before it moves, so the dialog can move
        // along with it (same approach as KeyboardAvoidingView); the did* events
        // above then correct a dialog opened mid-transition.
        if (react_native_1.Platform.OS === "ios") {
            subscriptions.push(react_native_1.Keyboard.addListener("keyboardWillShow", onShow), react_native_1.Keyboard.addListener("keyboardWillHide", onHide));
        }
        return () => subscriptions.forEach((subscription) => subscription.remove());
    }, [enabled]);
    return keyboardHeight;
}
const styles = react_native_1.StyleSheet.create({
    overlay: {
        zIndex: 1000,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        maxWidth: "80%",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
    },
});
