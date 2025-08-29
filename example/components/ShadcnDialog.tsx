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
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  ColorValue,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ShadcnDialogProps = Omit<DialogProps, "open"> & {
  buttonLabel: string;
  buttonColor: ColorValue;
  buttonStyle?: ViewStyle;
};

export function ShadcnDialog({
  buttonLabel,
  buttonColor,
  buttonStyle,
  ...props
}: ShadcnDialogProps) {
  const [open, setOpen] = useState(false);

  /* avoid input lag */
  const inputNameRef = useRef("");
  const inputUsernameRef = useRef("");

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    inputNameRef.current = "";
    inputUsernameRef.current = "";
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    Alert.alert(
      `Name: ${inputNameRef.current} - 
      Username: ${inputUsernameRef.current}`
    );
  }, []);

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
          <DialogTitle>Edit username</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <DialogInput
            placeholder="Your name"
            label="Name"
            onChangeText={(text) => (inputNameRef.current = text)}
          />
          <DialogInput
            placeholder="Your username"
            label="Username"
            onChangeText={(text) => (inputUsernameRef.current = text)}
          />
        </DialogBody>
        <DialogFooter>
          <DialogAction onPress={handleClose}>Cancel</DialogAction>
          <DialogAction onPress={handleConfirm}>Save changes</DialogAction>
        </DialogFooter>
      </Dialog>
    </>
  );
}
