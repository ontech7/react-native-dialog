import React from "react";
import { type ViewProps } from "react-native";
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
     * @deprecated Use `onRequestClose`. Kept as its fallback: when `onRequestClose`
     * isn't set, `onPressOut` handles the backdrop, the Android back button and
     * the iOS escape gesture.
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
export declare function Dialog({ open, onRequestClose, onPressOut, onShow, onDismiss, avoidKeyboard, tint, animation, duration, delay, slideFrom, BlurComponent, blurProps, overlayColor, style, children, testID, pointerEvents, ...props }: DialogProps): React.JSX.Element | null;
