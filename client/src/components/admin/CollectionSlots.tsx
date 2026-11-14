import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { RefreshCw } from "lucide-react-native";
import type { Product } from "@/types/product";
import { useTheme, radius } from "@/theme";
import { formatPrice } from "@/utils/format";
import CollectionSwapSheet from "./CollectionSwapSheet";

export interface CollectionSlotsProps {
  collectionName: "Featured" | "New arrival";
  products: Product[];
  allProducts: Product[];
  onReplace: (removeId: string, addId: string) => void;
}

export default function CollectionSlots({
  collectionName,
  products,
  allProducts,
  onReplace,
}: CollectionSlotsProps) {
  const { colors } = useTheme();
  const [activeSlotProduct, setActiveSlotProduct] = useState<Product | null>(null);

  const candidateProducts = allProducts.filter(
    (p) => !products.some((member) => member.id === p.id)
  );

  const handleOpenReplace = (product: Product) => {
    setActiveSlotProduct(product);
  };

  const handleConfirmSwap = (addId: string) => {
    if (!activeSlotProduct) return;
    onReplace(activeSlotProduct.id, addId);
    setActiveSlotProduct(null);
  };

  return (
    <View style={{ marginTop: 8 }}>
      {/* Header bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: colors.muted.foreground,
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          Always exactly 6 products
        </Text>

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: radius.full,
            backgroundColor: colors.surface.elevated,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
          }}
        >
          <Text
            style={{
              color: colors.primary.DEFAULT,
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            {products.length} / 6
          </Text>
        </View>
      </View>

      {/* 6 Numbered Slot Cards */}
      {products.map((product, index) => {
        const imageUri =
          product.image ||
          (product.images && product.images.length > 0 ? product.images[0] : "");

        return (
          <View
            key={product.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              backgroundColor: colors.card.DEFAULT,
              marginBottom: 10,
            }}
          >
            {/* Slot number bubble */}
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: radius.full,
                backgroundColor: colors.surface.elevated,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: colors.muted.foreground,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                #{index + 1}
              </Text>
            </View>

            {/* Thumbnail */}
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.md,
                backgroundColor: colors.surface.DEFAULT,
                marginRight: 12,
              }}
              contentFit="cover"
            />

            {/* Details */}
            <View style={{ flex: 1, marginRight: 8 }}>
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
              <Text
                style={{
                  color: colors.muted.foreground,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {formatPrice(product.price)} · {product.category || "General"}
              </Text>
            </View>

            {/* Replace Button */}
            <Pressable
              onPress={() => handleOpenReplace(product)}
              accessibilityRole="button"
              accessibilityLabel={`Replace slot ${index + 1}, currently ${product.name}`}
              style={({ pressed }) => ({
                height: 36,
                paddingHorizontal: 12,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border.strong,
                backgroundColor: pressed ? colors.surface.elevated : colors.surface.DEFAULT,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <RefreshCw size={14} color={colors.foreground.DEFAULT} strokeWidth={2} />
              <Text
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 12,
                  fontWeight: "600",
                  marginLeft: 6,
                }}
              >
                Replace
              </Text>
            </Pressable>
          </View>
        );
      })}

      {/* Replacement Picker Modal Sheet */}
      {activeSlotProduct && (
        <CollectionSwapSheet
          visible={true}
          onClose={() => setActiveSlotProduct(null)}
          collectionName={collectionName}
          mode="choose_replacement"
          currentMembers={products}
          candidateProducts={candidateProducts}
          onConfirm={handleConfirmSwap}
        />
      )}
    </View>
  );
}

