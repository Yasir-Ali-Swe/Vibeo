import { View, Text, Pressable } from "react-native";
import { ShoppingCart } from "lucide-react-native";

import { useTheme } from "@/theme";

interface ProductPurchaseBarProps {
  inStock?: boolean;
  inCart: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  bottomInset: number;
}

export default function ProductPurchaseBar({
  inStock = true,
  inCart,
  onAddToCart,
  onBuyNow,
  bottomInset,
}: ProductPurchaseBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{ paddingBottom: Math.max(bottomInset, 12) }}
      className="border-t border-border bg-background px-4 pt-3"
    >
      {inStock ? (
        <View className="flex-row gap-3">
          <Pressable
            onPress={onAddToCart}
            accessibilityRole="button"
            accessibilityState={{ selected: inCart }}
            accessibilityLabel={inCart ? "Remove from cart" : "Add to cart"}
            className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md border border-border-strong bg-card active:bg-surface-elevated"
          >
            <ShoppingCart
              size={18}
              strokeWidth={2}
              style={{ marginRight: 8 }}
              color={inCart ? colors.primary.DEFAULT : colors.foreground.DEFAULT}
              fill={inCart ? colors.primary.DEFAULT : "none"}
            />
            <Text className="text-sm font-bold text-foreground">
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onBuyNow}
            accessibilityRole="button"
            accessibilityLabel="Buy now"
            className="h-12 flex-1 items-center justify-center rounded-md bg-primary active:bg-primary-dark"
          >
            <Text className="text-sm font-bold text-primary-foreground">Buy Now</Text>
          </Pressable>
        </View>
      ) : (
        <View className="h-12 items-center justify-center rounded-md border border-border bg-card opacity-60">
          <Text className="text-sm font-bold text-muted-foreground">Out of Stock</Text>
        </View>
      )}
    </View>
  );
}
