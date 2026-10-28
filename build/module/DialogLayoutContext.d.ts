export type DialogLayout = {
    /**
     * Called by a scrollable `DialogBody`: the dialog caps its height only while
     * one is mounted, since nothing else can shrink to fit. Returns the cleanup.
     */
    registerScrollable: () => () => void;
};
export declare const DialogLayoutContext: import("react").Context<DialogLayout | null>;
