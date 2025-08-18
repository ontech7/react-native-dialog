import {
  Dialog,
  DialogAction,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProps,
  DialogTitle,
} from "@ontech7/expo-dialog";
import { useCallback, useState } from "react";
import {
  ColorValue,
  Image,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";

type CustomDialogProps = Omit<DialogProps, "open"> & {
  buttonLabel: string;
  buttonColor: ColorValue;
  buttonStyle?: ViewStyle;
};

export function CustomDialog({
  buttonLabel,
  buttonColor,
  buttonStyle,
  ...props
}: CustomDialogProps) {
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
              <ExclamationTriangleIcon
                size={22}
                color="#EED202"
                style={{ marginBottom: -3 }}
              />
            }
          >
            Attention!
          </DialogTitle>
          <DialogDescription>
            This is a CUSTOM dialog.{"\n"}Please click one of the buttons below
            to close it.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Image
            source={require("../assets/images/cat.jpg")}
            width={400}
            height={600}
            style={{ width: "100%", height: 300 }}
          />
        </DialogBody>
        <DialogFooter>
          <DialogAction
            onPress={handleClose}
            adornmentEnd={<XMarkIcon size={20} />}
          >
            Close
          </DialogAction>
          <DialogAction
            onPress={handleClose}
            adornmentEnd={<CheckIcon size={20} />}
          >
            Confirm
          </DialogAction>
        </DialogFooter>
      </Dialog>
    </>
  );
}
