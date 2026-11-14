import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import type { CartItemProps } from "@/types/cart";
import { formatPrice } from "@/utils/format";
import { useTheme, radius } from "@/theme";
import { useAppSelector, selectProductById } from "@/store";

function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const { colors } = useTheme();

  const baseProductId = item.id.split("::")[0];
  const catalogProduct = useAppSelector(selectProductById(baseProductId));
  const imageUri =
    item.image ||
    item.images?.[0] ||
    catalogProduct?.image ||
    catalogProduct?.images?.[0] ||
    "";

  return (
    <View className="flex-row items-center gap-3 py-4 border-b border-border">
      <Image
        source={{ uri: imageUri }}
        style={{ width: 76, height: 76, borderRadius: radius.sm }}
        className="bg-surface border border-border"
        contentFit="cover"
        transition={200}
      />

      <View className="flex-1 gap-2">
        <Text
          className="text-foreground font-semibold text-sm"
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View className="flex-row items-center gap-3">
          <Pressable
            disabled={item.quantity <= 1}
            onPress={() => onQuantityChange(item.id, item.quantity - 1)}
            accessibilityRole="button"
            accessibilityState={{ disabled: item.quantity <= 1 }}
            accessibilityLabel={`Decrease quantity of ${item.name}`}
            className={`w-7 h-7 rounded-sm border border-border-strong items-center justify-center ${item.quantity <= 1 ? "opacity-30" : "active:bg-surface-elevated"
              }`}
          >
            <Minus size={14} color={colors.foreground.DEFAULT} />
          </Pressable>

          <Text className="text-foreground font-bold text-sm min-w-4 text-center">
            {item.quantity}
          </Text>

          <Pressable
            onPress={() => onQuantityChange(item.id, item.quantity + 1)}
            accessibilityRole="button"
            accessibilityLabel={`Increase quantity of ${item.name}`}
            className="w-7 h-7 rounded-sm bg-primary items-center justify-center active:bg-primary-dark"
          >
            <Plus size={14} color={colors.primary.foreground} />
          </Pressable>
        </View>
      </View>

      <View className="items-end justify-between self-stretch py-1">
        <Pressable
          onPress={() => onRemove(item.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name} from cart`}
        >
          <Trash2 size={16} color={colors.destructive.DEFAULT} />
        </Pressable>

        <Text className="text-foreground font-bold text-sm">
          {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

export default memo(CartItem);
