import { memo } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { MoreVertical } from "lucide-react-native";
import type { Product } from "@/types/product";
import { useTheme, radius } from "@/theme";
import { formatPrice } from "@/utils/format";
import { withAlpha } from "@/utils/color";

export interface ProductRowProps {
  product: Product;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductRow({ product, onPress, onEdit, onDelete }: ProductRowProps) {
  const { colors } = useTheme();

  const handleMorePress = () => {
    Alert.alert(
      product.name,
      `Category: ${product.category || "Uncategorized"} · Stock: ${product.stock ?? 0}`,
      [
        { text: "Edit", onPress: onEdit },
        { text: "Delete", style: "destructive", onPress: onDelete },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const stockColor = isOutOfStock
    ? colors.destructive.DEFAULT
    : isLowStock
      ? colors.warning.DEFAULT
      : colors.muted.foreground;

  const stockLabel = isOutOfStock
    ? "Out of stock"
    : isLowStock
      ? `Low stock ${stock}`
      : `In stock ${stock}`;

  const imageUri =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : "");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}, ${stockLabel}`}
      style={({ pressed }) => ({
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.DEFAULT,
        backgroundColor: pressed ? colors.surface.elevated : colors.card.DEFAULT,
        flexDirection: "row",
        alignItems: "center",
      })}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: imageUri }}
        style={{
          width: 52,
          height: 52,
          borderRadius: radius.md,
          backgroundColor: colors.surface.DEFAULT,
        }}
        contentFit="cover"
      />

      {/* Info column */}
      <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
        <Text
          numberOfLines={1}
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {product.name}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 3,
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              color: colors.muted.foreground,
              fontSize: 12,
              marginRight: 8,
            }}
          >
            {product.category || "General"}
          </Text>

          {/* Badges */}
          {product.isFeatured && (
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.primary.DEFAULT, 0.15),
                marginRight: 4,
              }}
            >
              <Text
                style={{
                  color: colors.primary.DEFAULT,
                  fontSize: 10,
                  fontWeight: "700",
                }}
              >
                Featured
              </Text>
            </View>
          )}

          {product.isNewArrival && (
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: radius.full,
                backgroundColor: withAlpha(colors.success.DEFAULT, 0.15),
              }}
            >
              <Text
                style={{
                  color: colors.success.DEFAULT,
                  fontSize: 10,
                  fontWeight: "700",
                }}
              >
                New
              </Text>
            </View>
          )}
        </View>

        {/* Price and Stock row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: colors.foreground.DEFAULT,
              fontSize: 13,
              fontWeight: "700",
              marginRight: 6,
            }}
          >
            {formatPrice(product.price)}
          </Text>

          {product.originalPrice && product.originalPrice > product.price ? (
            <Text
              style={{
                color: colors.muted.subtle,
                fontSize: 11,
                textDecorationLine: "line-through",
                marginRight: 8,
              }}
            >
              {formatPrice(product.originalPrice)}
            </Text>
          ) : null}

          <Text
            style={{
              color: stockColor,
              fontSize: 11,
              fontWeight: "600",
              marginLeft: "auto",
            }}
          >
            {stockLabel}
          </Text>
        </View>
      </View>

      {/* Trailing action menu trigger */}
      <Pressable
        onPress={handleMorePress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Options for ${product.name}`}
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.full,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MoreVertical size={18} color={colors.muted.foreground} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

export default memo(ProductRow);

