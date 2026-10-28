import React from "react";
import { type ScrollViewProps, type ViewProps } from "react-native";
export type DialogBodyProps = ViewProps & {
    /**
     * Render the content in a `ScrollView` that shrinks to fit the dialog's max
     * height, so long content scrolls while the header and footer stay visible.
     */
    scrollable?: boolean;
    /** Extra props for the `ScrollView` used when `scrollable` is set. */
    scrollViewProps?: Omit<ScrollViewProps, "style" | "contentContainerStyle">;
};
export declare function DialogBody({ children, style, scrollable, scrollViewProps, ...props }: DialogBodyProps): React.JSX.Element;
