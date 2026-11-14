import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "@/types/cart";
import type { Product, SelectedVariants } from "@/types/product";
import { deleteProduct } from "./productsSlice";

const initialState: CartState = {
  items: [
    {
      id: "na-3",
      name: "AeroGlide Runner Low-Top Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      price: 6500,
      quantity: 1,
    },
    {
      id: "na-1",
      name: "Minimalist Leather Chrono Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      price: 8900,
      quantity: 1,
    },
  ],
  discount: 0,
};

export function getCartLineId(productId: string, selectedVariants?: SelectedVariants): string {
  if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
    return productId;
  }
  const serialized = Object.entries(selectedVariants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join(";");
  return `${productId}::${serialized}`;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number; selectedVariants?: SelectedVariants } | Product>
    ) => {
      const payload = action.payload;
      if (!payload) return;
      const product = "product" in payload ? payload.product : payload;
      if (!product || !product.id) return;

      // Do not add if explicitly out of stock
      if (product.inStock === false || product.stock === 0) {
        return;
      }

      const quantityToAdd = "product" in payload && payload.quantity ? payload.quantity : 1;
      const selectedVariants = "product" in payload ? payload.selectedVariants : undefined;

      const lineId = getCartLineId(product.id, selectedVariants);
      const existing = state.items.find((item) => item.id === lineId);
      const stockLimit = product.stock !== undefined && product.stock > 0 ? product.stock : 20;

      if (existing) {
        // Respect the stock limit when increasing quantity
        existing.quantity = Math.min(stockLimit, existing.quantity + quantityToAdd);
      } else {
        const image = product.image || product.images?.[0] || "";
        const item: CartItem = {
          ...product,
          id: lineId,
          image,
          quantity: Math.min(stockLimit, Math.max(1, quantityToAdd)),
          selectedVariants,
        };
        state.items.push(item);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (state.items.length === 0) {
        state.discount = 0;
      }
    },
    removeProductFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (!productId) return;
      state.items = state.items.filter(
        (item) => item.id !== productId && !item.id.startsWith(`${productId}::`)
      );
      if (state.items.length === 0) {
        state.discount = 0;
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      const stockLimit = item.stock !== undefined && item.stock > 0 ? item.stock : 20;
      // Quantity can never go below 1 via update (removal is a separate action)
      item.quantity = Math.max(1, Math.min(stockLimit, quantity));
    },
    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.discount = 0;
    },
    setCartState: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.discount = action.payload.discount;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteProduct, (state, action) => {
      const productId = action.payload.id;
      if (!productId) return;
      state.items = state.items.filter(
        (item) => item.id !== productId && !item.id.startsWith(`${productId}::`)
      );
      if (state.items.length === 0) {
        state.discount = 0;
      }
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  removeProductFromCart,
  updateQuantity,
  applyDiscount,
  clearCart,
  setCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
