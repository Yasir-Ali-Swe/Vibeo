import { Pressable, Text, View } from "react-native";
import { Banknote, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface PaymentMethodCardProps {
  selected: boolean;
  onPress: () => void;
}

export default function PaymentMethodCard({
  selected,
  onPress,
}: PaymentMethodCardProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel="Cash on Delivery, Pay when your order arrives"
      className={`flex-row items-center rounded-lg border p-4 ${selected
        ? "bg-primary/10 border-primary"
        : "bg-surface border-border"
        }`}
    >
      <View className="w-12 h-12 rounded-md bg-surface-elevated items-center justify-center">
        <Banknote size={25} color={colors.primary.DEFAULT} />
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-foreground font-semibold text-base">
          Cash on Delivery
        </Text>

        <Text className="text-muted-foreground text-xs mt-1">
          Pay when your order arrives
        </Text>
      </View>

      <CheckCircle2
        size={23}
        color={selected ? colors.primary.DEFAULT : colors.muted.subtle}
        fill={selected ? colors.primary.DEFAULT : "transparent"}
      />
    </Pressable>
  );
}

