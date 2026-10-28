import { DemoButton } from "@/components/DemoButton";
import { useDialog } from "@ontech7/react-native-dialog";
import { ColorValue, View } from "react-native";

type ImperativeDialogsProps = {
  color: ColorValue;
};

export function ImperativeDialogs({ color }: ImperativeDialogsProps) {
  const dialog = useDialog();

  const handleConfirm = async () => {
    const confirmed = await dialog.confirm({
      title: "Delete this note?",
      description: "It will be gone for good. This action cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });

    await dialog.alert({
      title: confirmed ? "Note deleted" : "Nothing changed",
      description: confirmed
        ? "The note has been removed."
        : "Your note is still there.",
    });
  };

  return (
    <View style={{ gap: 12 }}>
      <DemoButton
        label="USEDIALOG CONFIRM"
        color={color}
        onPress={handleConfirm}
      />
    </View>
  );
}
