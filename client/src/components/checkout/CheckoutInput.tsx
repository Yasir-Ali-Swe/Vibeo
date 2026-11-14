import { Text, TextInput, View } from "react-native";
import { useTheme } from "@/theme";

export interface CheckoutInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "phone-pad" | "email-address";
}

export default function CheckoutInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: CheckoutInputProps) {
  const { colors, isDark } = useTheme();
  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-foreground-muted mb-2">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted.subtle}
        selectionColor={colors.primary.DEFAULT}
        keyboardAppearance={isDark ? "dark" : "light"}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`bg-input border border-border rounded-md px-4 text-foreground text-sm ${multiline ? "h-28 py-3" : "h-14"
          }`}
      />
    </View>
  );
}

