import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Heart, ShoppingBag, PackageX } from "lucide-react-native";

import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductPrice from "@/components/products/ProductPrice";
import ProductVariantPicker from "@/components/products/ProductVariantPicker";
import ProductQuantitySelector from "@/components/products/ProductQuantitySelector";
import ProductPurchaseBar from "@/components/products/ProductPurchaseBar";
import type { SelectedVariants } from "@/types/product";
import {
  useAppDispatch,
  useAppSelector,
  selectProductById,
  selectIsInWishlist,
  selectIsInCart,
  selectCartTotalCount,
} from "@/store";
import { toggleWishlist } from "@/store/wishlistSlice";
import { addToCart, removeProductFromCart } from "@/store/cartSlice";
import { useTheme } from "@/theme";

export default function ProductDetailScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<"/products/[id]">();
  const dispatch = useAppDispatch();

  const rawId = Array.isArray(id) ? id[0] : id;
  const productId = rawId && rawId !== "index" ? rawId : "";
  const product = useAppSelector(selectProductById(productId));

  const isWishlisted = useAppSelector(selectIsInWishlist(productId));
  const isInCart = useAppSelector(selectIsInCart(productId));
  const cartCount = useAppSelector(selectCartTotalCount);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [missingVariants, setMissingVariants] = useState<string[]>([]);

  if (!product) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 items-center justify-center bg-background px-6"
      >
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full border border-border bg-surface">
          <PackageX size={28} color={colors.muted.foreground} strokeWidth={1.75} />
        </View>
        <Text className="text-lg font-bold text-foreground">Product not found</Text>
        <Text className="mb-6 mt-1.5 max-w-[260px] text-center text-xs leading-4 text-muted-foreground">
          This product is unavailable or has been removed from the catalog.
        </Text>
        <Pressable
          onPress={() => router.replace("/products")}
          accessibilityRole="button"
          className="rounded-md bg-primary px-6 py-3 active:bg-primary-dark"
        >
          <Text className="text-sm font-bold text-primary-foreground">
            Browse products
          </Text>
        </Pressable>
      </View>
    );
  }

  const stockLimit = product.stock ?? 20;
  const isInStock = !(product.inStock === false || product.stock === 0);

  const handleSelectOption = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
    setMissingVariants((prev) => prev.filter((name) => name !== variantName));
  };

  // Returns true when every required variant has a selection
  const validate = () => {
    const missing = (product.variants ?? [])
      .filter((v) => v.options && v.options.length > 0 && !selectedVariants[v.name])
      .map((v) => v.name);
    setMissingVariants(missing);
    return missing.length === 0;
  };

  const addCurrentToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedVariants:
          Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      })
    );
  };

  const handleAddToCart = () => {
    // Already in cart: tapping again removes every line of this product
    if (isInCart) {
      dispatch(removeProductFromCart(product.id));
      return;
    }

    if (!validate()) return;
    addCurrentToCart();
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    addCurrentToCart();
    router.push("/checkout");
  };

  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
        >
          <ArrowLeft size={20} color={colors.foreground.DEFAULT} strokeWidth={2} />
        </Pressable>
        <View className="flex-row items-center gap-2.5">
          <Pressable
            onPress={() => dispatch(toggleWishlist(product))}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
          >
            <Heart
              size={19}
              strokeWidth={2}
              color={isWishlisted ? colors.destructive.DEFAULT : colors.foreground.DEFAULT}
              fill={isWishlisted ? colors.destructive.DEFAULT : "transparent"}
            />
          </Pressable>

          <Pressable
            onPress={() => router.navigate("/cart")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
          >
            <ShoppingBag size={19} color={colors.foreground.DEFAULT} strokeWidth={2} />
            {cartCount > 0 && (
              <View className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-primary px-1">
                <Text className="text-[10px] font-bold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <ProductImageGallery images={product.images} fallbackImage={product.image} />
        <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
          <View className="gap-3">
            <Text className="text-2xl font-bold leading-8 tracking-tight text-foreground">
              {product.name}
            </Text>
            <ProductPrice
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercent={product.discountPercent}
              size="lg"
            />

            {product.description ? (
              <Text className="text-sm leading-6 text-muted-foreground">
                {product.description}
              </Text>
            ) : null}
          </View>

          {/* Variants */}
          {hasVariants && (
            <ProductVariantPicker
              variants={product.variants}
              selectedVariants={selectedVariants}
              onSelectOption={handleSelectOption}
              unselectedErrors={missingVariants}
            />
          )}

          {/* Quantity */}
          {isInStock && (
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold text-foreground">Quantity</Text>
                {stockLimit < 10 && (
                  <Text className="mt-0.5 text-xs text-muted-foreground">
                    Only {stockLimit} left
                  </Text>
                )}
              </View>
              <ProductQuantitySelector
                quantity={quantity}
                maxQuantity={stockLimit}
                onIncrease={() => setQuantity((q) => Math.min(stockLimit, q + 1))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <ProductPurchaseBar
        inStock={isInStock}
        inCart={isInCart}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        bottomInset={insets.bottom}
      />
    </View>
  );
}