import type { Product } from "./product";

export type WishlistProduct = Product;

export interface WishlistState {
  items: WishlistProduct[];
}

export interface WishlistItemProps {
  product: WishlistProduct;
  onRemove: (id: string) => void;
  onAddToCart?: (product: WishlistProduct) => void;
}
