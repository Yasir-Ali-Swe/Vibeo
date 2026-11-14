import { memo } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";

import WishlistHeartButton from "@/components/wishlist/WishlistHeartButton";
import CartToggleButton from "@/components/cart/CartToggleButton";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format";
import {
  useAppDispatch,
  useAppSelector,
  selectIsInWishlist,
} from "@/store";
import { toggleWishlist } from "@/store/wishlistSlice";

export interface ProductActionCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  variant?: "grid" | "carousel";
}

function ProductActionCard({ product, onPress }: ProductActionCardProps) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsInWishlist(product.id));

  const handleProductPress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push({
        pathname: "/products/[id]",
        params: { id: product.id },
      });
    }
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <View className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
      {/* Product Image Container */}
      <View className="relative w-full aspect-square bg-surface">
        <Pressable
          onPress={handleProductPress}
          accessibilityRole="button"
          accessibilityLabel={`View ${product.name}`}
          className="w-full h-full active:opacity-95"
        >
          <Image
            source={{ uri: product.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </Pressable>

        {/* Wishlist Button */}
        <View className="absolute top-2.5 right-2.5 z-10">
          <WishlistHeartButton
            isWishlisted={isWishlisted}
            onPress={handleToggleWishlist}
            size={16}
          />
        </View>
      </View>

      {/* Product Information */}
      <View className="p-3 justify-between flex-1">
        <Pressable onPress={handleProductPress} className="active:opacity-95">
          <Text
            numberOfLines={2}
            className="text-xs font-semibold text-foreground leading-4 min-h-[32px]"
          >
            {product.name}
          </Text>
        </Pressable>

        {/* Price (left) .............. cart icon (right) */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <Pressable onPress={handleProductPress} hitSlop={6} className="active:opacity-95 flex-1">
            <Text className="text-sm font-bold text-primary">
              {formatPrice(product.price)}
            </Text>
          </Pressable>
          <CartToggleButton product={product} />
        </View>
      </View>
    </View>
  );
}

export default memo(ProductActionCard);
