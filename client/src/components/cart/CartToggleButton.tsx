import { memo } from "react";
import { Pressable } from "react-native";
import { ShoppingCart } from "lucide-react-native";

import type { Product, SelectedVariants } from "@/types/product";
import { useTheme } from "@/theme";
import {
  useAppDispatch,
  useAppSelector,
  selectIsInCart,
  addToCart,
  removeProductFromCart,
} from "@/store";

export interface CartToggleButtonProps {
  product: Product;
  size?: number;
}

// Picks the first option of every variant, e.g. { Size: "S", Color: "Black" }
function getDefaultVariants(product: Product): SelectedVariants | undefined {
  if (!product.variants || product.variants.length === 0) return undefined;

  const selected: SelectedVariants = {};
  for (const variant of product.variants) {
    if (variant.options.length > 0) {
      selected[variant.name] = variant.options[0];
    }
  }
  return Object.keys(selected).length > 0 ? selected : undefined;
}

function CartToggleButton({ product, size = 20 }: CartToggleButtonProps) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const inCart = useAppSelector(selectIsInCart(product.id));

  // Out of stock only when explicitly false or 0, never when undefined
  const isOutOfStock = product.inStock === false || product.stock === 0;

  const handlePress = () => {
    if (isOutOfStock) return;

    if (inCart) {
      dispatch(removeProductFromCart(product.id));
      return;
    }

    dispatch(
      addToCart({
        product,
        quantity: 1,
        selectedVariants: getDefaultVariants(product),
      })
    );
  };

  const accessibilityLabel = isOutOfStock
    ? "Out of stock"
    : inCart
      ? "Remove from cart"
      : "Add to cart";

  return (
    <Pressable
      onPress={handlePress}
      disabled={isOutOfStock}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected: inCart, disabled: isOutOfStock }}
      accessibilityLabel={accessibilityLabel}
      style={{
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        opacity: isOutOfStock ? 0.35 : 1,
      }}
    >
      <ShoppingCart
        size={size}
        color={inCart ? colors.primary.DEFAULT : colors.muted.foreground}
        fill={inCart ? colors.primary.DEFAULT : "none"}
        strokeWidth={2}
      />
    </Pressable>
  );
}

export default memo(CartToggleButton);