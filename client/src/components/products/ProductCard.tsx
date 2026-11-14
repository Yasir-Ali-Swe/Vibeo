import { memo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { Image as ImageIcon } from "lucide-react-native";
import CartToggleButton from "@/components/cart/CartToggleButton";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format";
import { useTheme } from "@/theme";

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

function ProductCard({ product, onPress }: ProductCardProps) {
  const { colors } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push({
        pathname: "/products/[id]",
        params: { id: product.id },
      });
    }
  };

  return (
    <View className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Product Image */}
      <View className="relative w-full aspect-square bg-surface items-center justify-center">
        <Pressable
          onPress={handlePress}
          className="w-full h-full items-center justify-center active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel={`View ${product.name}`}
        >
          {product.image && !imageError ? (
            <Image
              source={{ uri: product.image }}
              className="w-full h-full"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View className="items-center justify-center p-4">
              <ImageIcon size={28} color={colors.muted.subtle} strokeWidth={1.5} />
              <Text className="text-[10px] text-muted-subtle mt-1 text-center">
                No image
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Product Details */}
      <View className="p-3">
        <Pressable onPress={handlePress} className="active:opacity-90">
          <Text
            numberOfLines={1}
            className="text-xs font-semibold text-foreground tracking-tight"
          >
            {product.name}
          </Text>
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <Pressable onPress={handlePress} hitSlop={6} className="active:opacity-90 flex-1">
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

export default memo(ProductCard);
