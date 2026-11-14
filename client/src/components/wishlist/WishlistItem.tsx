import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import WishlistHeartButton from "./WishlistHeartButton";
import CartToggleButton from "@/components/cart/CartToggleButton";
import type { WishlistItemProps } from "@/types/wishlist";
import { formatPrice } from "@/utils/format";

function WishlistItem({
  product,
  onRemove,
}: WishlistItemProps) {
  const handlePress = () => {
    router.push({
      pathname: "/products/[id]",
      params: { id: product.id },
    });
  };

  return (
    <View className="mb-4 flex-1 overflow-hidden rounded-lg border border-border bg-card">
      <View className="relative">
        <Pressable
          onPress={handlePress}
          className="h-44 w-full active:opacity-95"
          accessibilityRole="button"
          accessibilityLabel={`View ${product.name}`}
        >
          <Image
            source={{ uri: product.image }}
            className="h-44 w-full bg-background"
            resizeMode="cover"
          />
        </Pressable>
        <View className="absolute right-3 top-3 z-10">
          <WishlistHeartButton
            isWishlisted={true}
            onPress={() => onRemove(product.id)}
          />
        </View>
      </View>

      <View className="p-3">
        <Pressable onPress={handlePress} className="active:opacity-95">
          <Text
            numberOfLines={2}
            className="min-h-10 text-sm font-semibold text-foreground"
          >
            {product.name}
          </Text>
        </Pressable>

        {/* Price (left) .............. cart icon (right) */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <Pressable onPress={handlePress} hitSlop={6} className="active:opacity-95 flex-1">
            <Text className="text-base font-bold text-primary">
              {formatPrice(product.price)}
            </Text>
          </Pressable>
          <CartToggleButton product={product} />
        </View>
      </View>
    </View>
  );
}

export default memo(WishlistItem);
