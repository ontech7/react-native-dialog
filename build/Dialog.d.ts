import React from "react";
import { type ViewProps } from "react-native";
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
export declare function Dialog({ open, onPressOut, tint, animation, duration, delay, slideFrom, BlurComponent, blurProps, overlayColor, style, children, ...props }: DialogProps): React.JSX.Element | null;
