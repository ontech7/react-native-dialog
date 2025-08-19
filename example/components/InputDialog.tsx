import {
  Dialog,
  DialogAction,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInput,
  DialogProps,
  DialogTitle,
} from "@ontech7/react-native-dialog";
import { useCallback, useState } from "react";
import {
  Alert,
  ColorValue,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ExclamationTriangleIcon } from "react-native-heroicons/outline";

type InputDialogProps = Omit<DialogProps, "open"> & {
  buttonLabel: string;
  buttonColor: ColorValue;
  buttonStyle?: ViewStyle;
};

export function InputDialog({
  buttonLabel,
  buttonColor,
  buttonStyle,
  ...props
}: InputDialogProps) {
  const [open, setOpen] = useState(false);

  const [text, setText] = useState("");

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    Alert.alert("Text: ", text);
  }, [text]);

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
            This is an INPUT dialog.{"\n"}Write something and click Confirm to
            show the output.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <DialogInput onChangeText={setText} value={text} />
        </DialogBody>
        <DialogFooter>
          <DialogAction onPress={handleClose}>Close</DialogAction>
          <DialogAction onPress={handleConfirm}>Confirm</DialogAction>
        </DialogFooter>
      </Dialog>
    </>
  );
}
