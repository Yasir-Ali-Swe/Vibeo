import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WishlistProduct, WishlistState } from "@/types/wishlist";
import { deleteProduct } from "./productsSlice";

const initialState: WishlistState = {
  items: [
    {
      id: "na-2",
      name: "Acoustic Pro Wireless Studio Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      price: 14500,
    },
    {
      id: "na-1",
      name: "Minimalist Leather Chrono Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      price: 8900,
    },
    {
      id: "na-3",
      name: "AeroGlide Runner Low-Top Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      price: 6500,
    },
    {
      id: "na-4",
      name: "Heritage Waxed Canvas Daypack",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      price: 5200,
    },
  ],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistProduct>) => {
      if (!action.payload || !action.payload.id) return;
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push({
          ...action.payload,
          image: action.payload.image || action.payload.images?.[0] || "",
        });
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      if (!action.payload) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleWishlist: (state, action: PayloadAction<WishlistProduct>) => {
      if (!action.payload || !action.payload.id) return;
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          ...action.payload,
          image: action.payload.image || action.payload.images?.[0] || "",
        });
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlistState: (state, action: PayloadAction<WishlistState>) => {
      state.items = action.payload.items;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteProduct, (state, action) => {
      const productId = action.payload.id;
      if (!productId) return;
      state.items = state.items.filter((item) => item.id !== productId);
    });
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  setWishlistState,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
