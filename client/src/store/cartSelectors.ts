import { createSelector } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "@/types/cart";
import type { RootState } from "./index";

export const TAX_RATE = 0.02;
export const DELIVERY_FEE = 250;

const selectCartState = (state: RootState): CartState => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (cart: CartState): CartItem[] => cart.items
);

export const selectCartDiscount = createSelector(
  selectCartState,
  (cart: CartState): number => cart.discount
);

export const selectCartTotalCount = createSelector(
  selectCartItems,
  (items: CartItem[]): number =>
    items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
);

export const selectCartCount = selectCartTotalCount;

export const selectCartSubtotal = createSelector(
  selectCartItems,
  (items: CartItem[]): number =>
    items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
);

export const selectCartTax = createSelector(
  selectCartSubtotal,
  (subtotal: number): number => subtotal * TAX_RATE
);

export const selectCartDeliveryFee = createSelector(
  selectCartItems,
  (items: CartItem[]): number => (items.length > 0 ? DELIVERY_FEE : 0)
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartTax, selectCartDeliveryFee, selectCartDiscount],
  (subtotal: number, tax: number, delivery: number, discount: number): number =>
    Math.max(0, subtotal + tax + delivery - discount)
);

export const selectCartTotalAmount = selectCartTotal;

const lineTotalCache = new Map<string, (state: RootState) => number>();

export const selectLineTotal = (lineId: string) => {
  let selector = lineTotalCache.get(lineId);
  if (!selector) {
    selector = createSelector(selectCartItems, (items: CartItem[]): number => {
      const item = items.find((i: CartItem) => i.id === lineId);
      return item ? item.price * item.quantity : 0;
    });
    lineTotalCache.set(lineId, selector);
  }
  return selector;
};

const isInCartCache = new Map<string, (state: RootState) => boolean>();

export const selectIsInCart = (productId: string) => {
  if (!productId) return () => false;
  let selector = isInCartCache.get(productId);
  if (!selector) {
    selector = createSelector(selectCartItems, (items: CartItem[]): boolean =>
      items.some(
        (item: CartItem) =>
          item.id === productId || item.id.startsWith(`${productId}::`)
      )
    );
    isInCartCache.set(productId, selector);
  }
  return selector;
};
