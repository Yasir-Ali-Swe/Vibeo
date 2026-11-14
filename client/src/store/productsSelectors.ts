import { createSelector } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import type { ProductsState } from "./productsSlice";
import type { RootState } from "./index";

const selectProductsState = (state: RootState): ProductsState => state.products;

export const selectAllProducts = createSelector(
  selectProductsState,
  (state: ProductsState): Product[] => state?.products ?? []
);

const productByIdCache = new Map<string, (state: RootState) => Product | null>();

export const selectProductById = (id: string) => {
  if (!id) return () => null;
  let selector = productByIdCache.get(id);
  if (!selector) {
    selector = createSelector(
      selectAllProducts,
      (products: Product[]): Product | null =>
        products.find((p: Product) => p.id === id) ?? null
    );
    productByIdCache.set(id, selector);
  }
  return selector;
};

export const selectFeaturedProducts = createSelector(
  selectAllProducts,
  (products: Product[]): Product[] => products.filter((p) => p.isFeatured)
);

export const selectNewArrivalProducts = createSelector(
  selectAllProducts,
  (products: Product[]): Product[] => products.filter((p) => p.isNewArrival)
);

export const selectFeaturedCount = createSelector(
  selectFeaturedProducts,
  (featured: Product[]): number => featured.length
);

export const selectNewArrivalCount = createSelector(
  selectNewArrivalProducts,
  (newArrivals: Product[]): number => newArrivals.length
);

export const selectLowStockProducts = createSelector(
  selectAllProducts,
  (products: Product[]): Product[] =>
    products
      .filter((p) => (p.stock ?? 0) <= 5)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
);

export const selectLowStockCount = createSelector(
  selectLowStockProducts,
  (lowStock: Product[]): number => lowStock.length
);

export const selectProductCategories = createSelector(
  selectAllProducts,
  (products: Product[]): string[] => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.category) set.add(p.category);
    }
    return Array.from(set);
  }
);

