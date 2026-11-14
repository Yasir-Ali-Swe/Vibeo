import { createSelector } from "@reduxjs/toolkit";
import type { WishlistProduct, WishlistState } from "@/types/wishlist";
import type { RootState } from "./index";

const selectWishlistState = (state: RootState): WishlistState => state.wishlist;

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (wishlist: WishlistState): WishlistProduct[] => wishlist.items
);

export const selectWishlistCount = createSelector(
  selectWishlistItems,
  (items: WishlistProduct[]): number => items.length
);

const isInWishlistCache = new Map<string, (state: RootState) => boolean>();

/**
 * Stable selector factory: returns the exact same memoized selector function
 * for a given product ID across renders, preventing unwanted component re-renders.
 */
export const selectIsInWishlist = (productId: string) => {
  if (!productId) return () => false;
  let selector = isInWishlistCache.get(productId);
  if (!selector) {
    selector = createSelector(
      selectWishlistItems,
      (items: WishlistProduct[]): boolean =>
        items.some((item: WishlistProduct) => item.id === productId)
    );
    isInWishlistCache.set(productId, selector);
  }
  return selector;
};
