import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Easing,
  Keyboard,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type KeyboardEvent,
  type ViewProps,
} from "react-native";
import { DialogControllerContext } from "./DialogControllerContext";
import { DialogStyleContext, useDialogStyles } from "./theme";
import { Portal } from "./components/Portal";
import { ModalStackContext } from "./components/PortalProvider";

/** Space kept free above and below the dialog when it hits its max height. */
const VERTICAL_MARGIN = 64;
/** Same, while the keyboard is up: tighter, so a form still fits on small phones. */
const KEYBOARD_VERTICAL_MARGIN = 16;

let NEXT_DIALOG_ID = 0;

export type DialogProps = ViewProps & {
  open?: boolean;
  /**
   * Called when the user asks to dismiss the dialog: a tap on the backdrop, the
   * Android back button, or the iOS accessibility escape gesture. Set `open` to
   * `false` here. Omit it to make the dialog non-dismissible.
   */
  onRequestClose?: () => void;
  /**
   * Called when the backdrop is tapped.
   * @deprecated Use `onRequestClose`, which also handles the Android back button.
   */
  onPressOut?: () => Promise<void> | void;
  /** Called once the open animation has finished. */
  onShow?: () => void;
  /** Called once the close animation has finished and the dialog is unmounted. */
  onDismiss?: () => void;
  /** Lift the dialog above the software keyboard (default: `true`). */
  avoidKeyboard?: boolean;
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
  onRequestClose,
  onPressOut,
  onShow,
  onDismiss,
  avoidKeyboard = true,
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
  testID,
  pointerEvents,
  ...props
}: DialogProps) {
  const dialogStyles = useDialogStyles();
  const controller = useContext(DialogControllerContext);
  const modalStack = useContext(ModalStackContext);
  const dialogId = useRef(String(++NEXT_DIALOG_ID)).current;
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(open);
  const reduceMotion = useReduceMotion();
  const keyboardHeight = useKeyboardHeight(avoidKeyboard && mounted);

  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  // Latest callbacks, so effects don't re-run (or re-register the back
  // handler, losing its priority) when inline functions change every render.
  const callbacks = useRef({ onRequestClose, onPressOut, onShow, onDismiss });
  useEffect(() => {
    callbacks.current = { onRequestClose, onPressOut, onShow, onDismiss };
  });

  const wasOpen = useRef(open);

  useEffect(() => {
    const closing = wasOpen.current && !open;
    wasOpen.current = open;

    if (!animation) {
      progress.setValue(open ? 1 : 0);
      setMounted(open);
      if (open) callbacks.current.onShow?.();
      else if (closing) callbacks.current.onDismiss?.();
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
      }).start(({ finished }) => {
        if (finished) {
          callbacks.current.onShow?.();
        }
      });
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          if (closing) callbacks.current.onDismiss?.();
        }
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Registered once per opening, last = called first, so the topmost dialog
    // handles the press. Always consumed: an open dialog is modal, so the
    // press must not reach (and e.g. pop) the screen behind it, even when the
    // dialog can't be dismissed.
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        callbacks.current.onRequestClose?.();
        return true;
      }
    );

    return () => subscription.remove();
  }, [open]);

  const pushModal = modalStack?.push;
  const removeModal = modalStack?.remove;

  useEffect(() => {
    if (!open || !pushModal || !removeModal) return;

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

  // Taps are ignored while the close animation runs, so a double tap can't
  // trigger an action twice or dismiss twice.
  const requestClose = open
    ? () => {
        callbacks.current.onPressOut?.();
        callbacks.current.onRequestClose?.();
      }
    : undefined;

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
  // window dimensions cover the screen regardless of the ancestor layout; the
  // layers inside can then safely fill this overlay.
  const overlay = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width,
    height,
  };

  const margin =
    keyboardHeight > 0 ? KEYBOARD_VERTICAL_MARGIN : VERTICAL_MARGIN;
  const maxHeight = Math.max(0, height - keyboardHeight - 2 * margin);

  return (
    <Portal>
      {/* Content rendered in the portal lives at the host provider: hand it the
          styles (and useDialog controller) of the provider this dialog was
          declared in. */}
      <DialogStyleContext.Provider value={dialogStyles}>
        <DialogControllerContext.Provider value={controller}>
          <View
            style={[overlay, styles.overlay]}
            accessibilityViewIsModal={isTopmost}
            onAccessibilityEscape={requestClose}
          >
            {/* Backdrop (blur + dim) fades in/out with `progress` so the blur ramps up
              gradually instead of popping in. */}
            <Animated.View
              style={[StyleSheet.absoluteFill, { opacity: progress }]}
              pointerEvents="none"
            >
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
            {/* Dismiss layer: a sibling behind the dialog, not its parent, so taps on
              the dialog's own content never reach it. */}
            <Pressable
              testID={testID ? `${testID}-backdrop` : undefined}
              style={StyleSheet.absoluteFill}
              onPress={requestClose}
              accessible={false}
              importantForAccessibility="no"
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                { paddingBottom: keyboardHeight },
              ]}
              pointerEvents="box-none"
            >
              <Animated.View
                {...props}
                testID={testID}
                pointerEvents={open ? pointerEvents : "none"}
                style={[
                  styles.dialog,
                  { maxHeight },
                  dialogAnimStyle,
                  dialogStyles.container,
                  style,
                ]}
              >
                {children}
              </Animated.View>
            </View>
          </View>
        </DialogControllerContext.Provider>
      </DialogStyleContext.Provider>
    </Portal>
  );
}

function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => active && setReduceMotion(enabled))
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion
    );

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return reduceMotion;
}

/** Height of the software keyboard while `enabled`, 0 otherwise. */
function useKeyboardHeight(enabled: boolean) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const set = (next: number) => {
      current.current = next;
      setKeyboardHeight(next);
    };

    if (!enabled) {
      set(0);
      return;
    }

    // The keyboard may already be up when the dialog opens.
    set(Keyboard.metrics?.()?.height ?? 0);

    const update = (event: KeyboardEvent | undefined, next: number) => {
      // Focus moving between inputs re-fires the show event with the same
      // height: animating then would animate the next unrelated layout change.
      if (next === current.current) return;

      if (event?.duration) {
        LayoutAnimation.configureNext({
          duration: event.duration,
          update: {
            duration: event.duration,
            type: LayoutAnimation.Types[event.easing] ?? "keyboard",
          },
        });
      }
      set(next);
    };

    const onShow = (event: KeyboardEvent) =>
      update(event, event.endCoordinates.height);
    const onHide = (event: KeyboardEvent) => update(event, 0);

    const subscriptions = [
      Keyboard.addListener("keyboardDidShow", (event) =>
        update(undefined, event.endCoordinates.height)
      ),
      Keyboard.addListener("keyboardDidHide", () => update(undefined, 0)),
    ];

    // iOS also reports the keyboard before it moves, so the dialog can move
    // along with it (same approach as KeyboardAvoidingView); the did* events
    // above then correct a dialog opened mid-transition.
    if (Platform.OS === "ios") {
      subscriptions.push(
        Keyboard.addListener("keyboardWillShow", onShow),
        Keyboard.addListener("keyboardWillHide", onHide)
      );
    }

    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [enabled]);

  return keyboardHeight;
}

const styles = StyleSheet.create({
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
