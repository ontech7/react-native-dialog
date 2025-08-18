import {
  Dialog,
  DialogAction,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProps,
  DialogTitle,
} from "@ontech7/expo-dialog";
import { useCallback, useState } from "react";
import { ColorValue, Text, TouchableOpacity, ViewStyle } from "react-native";
import { ExclamationTriangleIcon } from "react-native-heroicons/outline";

type DefaultDialogProps = Omit<DialogProps, "open"> & {
  buttonLabel: string;
  buttonColor: ColorValue;
  buttonStyle?: ViewStyle;
};

export function DefaultDialog({
  buttonLabel,
  buttonColor,
  buttonStyle,
  ...props
}: DefaultDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        style={{
          ...buttonStyle,
          backgroundColor: buttonColor,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "500",
            paddingHorizontal: 12,
            paddingVertical: 8,
            textAlign: "center",
          }}
        >
          {buttonLabel}
        </Text>
      </TouchableOpacity>

      <Dialog open={open} {...props}>
        <DialogHeader>
          <DialogTitle
            adornmentStart={
              <ExclamationTriangleIcon size={22} style={{ marginBottom: -3 }} />
            }
          >
            Attention!
          </DialogTitle>
          <DialogDescription>
            This is a dialog.{"\n"}Please click one of the buttons below to
            close it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogAction onPress={handleClose}>Close</DialogAction>
          <DialogAction onPress={handleClose}>Confirm</DialogAction>
        </DialogFooter>
      </Dialog>
    </>
  );
}
