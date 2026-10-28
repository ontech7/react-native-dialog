import { ColorValue, Text, TouchableOpacity, ViewStyle } from "react-native";

type DemoButtonProps = {
  label: string;
  color: ColorValue;
  onPress: () => void;
  style?: ViewStyle;
};

export function DemoButton({ label, color, onPress, style }: DemoButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...style, backgroundColor: color }}
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
        {label}
      </Text>
    </TouchableOpacity>
  );
}
