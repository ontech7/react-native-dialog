import { DemoButton } from "@/components/DemoButton";
import {
  Dialog,
  DialogAction,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProps,
  DialogTitle,
} from "@ontech7/react-native-dialog";
import { useCallback, useState } from "react";
import { ColorValue, ViewStyle } from "react-native";

const NOTES = [
  "DialogTitle and DialogDescription now honor the `style` prop.",
  "Tapping inside the dialog no longer dismisses it.",
  "New `onRequestClose`: backdrop tap, Android back button and the iOS escape gesture.",
  "Long content scrolls with `<DialogBody scrollable>` while the footer stays visible.",
  "`DialogAction` variants: primary, secondary and destructive.",
  "`useDialog()` for imperative confirm / alert dialogs.",
  "Dialogs lift above the keyboard.",
  "Nested providers only scope styles; dialogs always cover the screen.",
  "`extendDialogTheme()` to tweak a preset without copying it.",
  "Screen readers: modal overlay, header and button roles, reduced motion.",
  "Ships a CommonJS build, so Jest works without transformIgnorePatterns.",
];

type ReleaseNotesDialogProps = Omit<DialogProps, "open"> & {
  buttonLabel: string;
  buttonColor: ColorValue;
  buttonStyle?: ViewStyle;
};

export function ReleaseNotesDialog({
  buttonLabel,
  buttonColor,
  buttonStyle,
  ...props
}: ReleaseNotesDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <DemoButton
        label={buttonLabel}
        color={buttonColor}
        style={buttonStyle}
        onPress={handleOpen}
      />

      <Dialog open={open} onRequestClose={handleClose} {...props}>
        <DialogHeader>
          <DialogTitle>Version 1.4.0 is available</DialogTitle>
          <DialogDescription>Here is what changed:</DialogDescription>
        </DialogHeader>
        <DialogBody scrollable>
          {[...NOTES, ...NOTES].map((note, i) => (
            <DialogDescription key={i} style={{ lineHeight: 22 }}>
              • {note}
            </DialogDescription>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogAction variant="secondary" onPress={handleClose}>
            Hide
          </DialogAction>
          <DialogAction variant="primary" onPress={handleClose}>
            Update now
          </DialogAction>
        </DialogFooter>
      </Dialog>
    </>
  );
}
