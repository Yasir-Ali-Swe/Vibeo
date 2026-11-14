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

export interface FeaturedProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

function FeaturedProductCard({
  product,
  onPress,
}: FeaturedProductCardProps) {
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
    <View className="w-56 bg-card border border-border rounded-lg overflow-hidden mr-3.5">
      {/* Product Image */}
      <View className="relative w-full h-40 bg-surface">
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

      {/* Product Details */}
      <View className="p-3.5 justify-between">
        <Pressable onPress={handleProductPress} className="active:opacity-95">
          <Text
            numberOfLines={1}
            className="text-sm font-bold text-foreground tracking-tight"
          >
            {product.name}
          </Text>
        </Pressable>

        {/* Price (left) .............. cart icon (right) */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <Pressable onPress={handleProductPress} hitSlop={6} className="active:opacity-95 flex-1">
            <Text className="text-base font-extrabold text-foreground">
              {formatPrice(product.price)}
            </Text>
          </Pressable>
          <CartToggleButton product={product} />
        </View>
      </View>
    </View>
  );
}

export default memo(FeaturedProductCard);
