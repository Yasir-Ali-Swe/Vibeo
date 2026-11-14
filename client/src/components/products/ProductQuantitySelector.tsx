import { View, Text, Pressable } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { useTheme } from "@/theme";

interface ProductQuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function ProductQuantitySelector({
  quantity,
  maxQuantity,
  onIncrease,
  onDecrease,
}: ProductQuantitySelectorProps) {
  const { colors } = useTheme();
  const isMin = quantity <= 1;
  const isMax = Boolean(maxQuantity && quantity >= maxQuantity);

  return (
    <View className="flex-row items-center bg-card border border-border rounded-md p-1">
      {/* Decrement button */}
      <Pressable
        disabled={isMin}
        onPress={onDecrease}
        className={`w-9 h-9 rounded-sm items-center justify-center ${isMin ? "opacity-30" : "active:bg-surface-elevated"
          }`}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Minus size={16} color={colors.foreground.DEFAULT} strokeWidth={2} />
      </Pressable>

      {/* Quantity value */}
      <Text className="text-foreground font-bold text-sm min-w-8 text-center">
        {quantity}
      </Text>

      {/* Increment button */}
      <Pressable
        disabled={isMax}
        onPress={onIncrease}
        className={`w-9 h-9 rounded-sm items-center justify-center ${isMax ? "opacity-30" : "active:bg-surface-elevated"
          }`}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Plus size={16} color={colors.foreground.DEFAULT} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

