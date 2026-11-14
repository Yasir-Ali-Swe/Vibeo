import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PRODUCTS } from "@/constants/products";
import type { Product } from "@/types/product";

export interface ProductsState {
  products: Product[];
}

export function repairCollections(products: Product[]): Product[] {
  if (products.length < 6) return products;

  const result = products.map((p) => {
    const stock = typeof p.stock === "number" ? p.stock : 0;
    const price = p.price ?? 0;
    const originalPrice = p.originalPrice;
    const discountPercent =
      originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : undefined;

    return {
      ...p,
      stock,
      inStock: stock > 0,
      discountPercent,
    };
  });

  // 1. Repair Featured invariant (exactly 6)
  let featuredCount = 0;
  for (const p of result) {
    if (p.isFeatured) {
      featuredCount++;
      if (featuredCount > 6) {
        p.isFeatured = false;
      }
    }
  }
  if (featuredCount < 6) {
    for (const p of result) {
      if (!p.isFeatured) {
        p.isFeatured = true;
        featuredCount++;
        if (featuredCount === 6) break;
      }
    }
  }

  // 2. Repair New Arrival invariant (exactly 6)
  let newArrivalCount = 0;
  for (const p of result) {
    if (p.isNewArrival) {
      newArrivalCount++;
      if (newArrivalCount > 6) {
        p.isNewArrival = false;
      }
    }
  }
  if (newArrivalCount < 6) {
    for (const p of result) {
      if (!p.isNewArrival) {
        p.isNewArrival = true;
        newArrivalCount++;
        if (newArrivalCount === 6) break;
      }
    }
  }

  return result;
}

const initialState: ProductsState = {
  products: repairCollections(PRODUCTS),
};

export interface SwapCollectionPayload {
  addId: string;
  removeId: string;
}

export interface AddProductPayload {
  product: Omit<Product, "id">;
  replaceFeaturedId?: string;
  replaceNewArrivalId?: string;
}

export interface DeleteProductPayload {
  id: string;
  replacements?: {
    featuredReplacementId?: string;
    newArrivalReplacementId?: string;
  };
}

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    swapFeatured: (state, action: PayloadAction<SwapCollectionPayload>) => {
      const { addId, removeId } = action.payload;
      if (addId === removeId) return;

      const toAdd = state.products.find((p) => p.id === addId);
      const toRemove = state.products.find((p) => p.id === removeId);

      // Invariant guard: toAdd must currently be unfeatured, toRemove must be featured
      if (!toAdd || !toRemove || toAdd.isFeatured || !toRemove.isFeatured) {
        return;
      }

      toAdd.isFeatured = true;
      toRemove.isFeatured = false;
    },

    swapNewArrival: (state, action: PayloadAction<SwapCollectionPayload>) => {
      const { addId, removeId } = action.payload;
      if (addId === removeId) return;

      const toAdd = state.products.find((p) => p.id === addId);
      const toRemove = state.products.find((p) => p.id === removeId);

      // Invariant guard: toAdd must currently be not a new arrival, toRemove must be one
      if (!toAdd || !toRemove || toAdd.isNewArrival || !toRemove.isNewArrival) {
        return;
      }

      toAdd.isNewArrival = true;
      toRemove.isNewArrival = false;
    },

    addProduct: (state, action: PayloadAction<AddProductPayload>) => {
      const { product: input, replaceFeaturedId, replaceNewArrivalId } = action.payload;

      // Handle atomic collection swaps if newly added product has collection switches ON
      const willBeFeatured = Boolean(input.isFeatured);
      const willBeNewArrival = Boolean(input.isNewArrival);

      if (willBeFeatured) {
        if (!replaceFeaturedId) return; // Invariant requirement
        const toRemove = state.products.find((p) => p.id === replaceFeaturedId);
        if (!toRemove || !toRemove.isFeatured) return;
        toRemove.isFeatured = false;
      }

      if (willBeNewArrival) {
        if (!replaceNewArrivalId) return; // Invariant requirement
        const toRemove = state.products.find((p) => p.id === replaceNewArrivalId);
        if (!toRemove || !toRemove.isNewArrival) return;
        toRemove.isNewArrival = false;
      }

      const id = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const stock = typeof input.stock === "number" ? Math.max(0, Math.floor(input.stock)) : 0;
      const price = Math.max(0, input.price ?? 0);
      const originalPrice = input.originalPrice && input.originalPrice > price ? input.originalPrice : undefined;
      const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;

      const newProduct: Product = {
        ...input,
        id,
        price,
        originalPrice,
        discountPercent,
        stock,
        inStock: stock > 0,
        isFeatured: willBeFeatured,
        isNewArrival: willBeNewArrival,
        images: input.images && input.images.length > 0 ? input.images : [input.image],
      };

      state.products.unshift(newProduct);
    },

    updateProduct: (
      state,
      action: PayloadAction<
        Partial<Product> & {
          id: string;
          replaceFeaturedId?: string;
          replaceNewArrivalId?: string;
        }
      >
    ) => {
      const { id, replaceFeaturedId, replaceNewArrivalId, ...updates } = action.payload;
      const target = state.products.find((p) => p.id === id);
      if (!target) return;

      // Handle Featured collection swap if flag is being changed
      if (typeof updates.isFeatured === "boolean" && updates.isFeatured !== target.isFeatured) {
        if (updates.isFeatured) {
          // Turning featured ON requires replacing an existing featured product
          if (!replaceFeaturedId || replaceFeaturedId === id) return;
          const toRemove = state.products.find((p) => p.id === replaceFeaturedId);
          if (!toRemove || !toRemove.isFeatured) return;
          toRemove.isFeatured = false;
          target.isFeatured = true;
        } else {
          // Turning featured OFF requires selecting another product to feature
          if (!replaceFeaturedId || replaceFeaturedId === id) return;
          const toAdd = state.products.find((p) => p.id === replaceFeaturedId);
          if (!toAdd || toAdd.isFeatured) return;
          toAdd.isFeatured = true;
          target.isFeatured = false;
        }
      }

      // Handle New Arrival collection swap if flag is being changed
      if (typeof updates.isNewArrival === "boolean" && updates.isNewArrival !== target.isNewArrival) {
        if (updates.isNewArrival) {
          // Turning new arrival ON requires replacing an existing new arrival
          if (!replaceNewArrivalId || replaceNewArrivalId === id) return;
          const toRemove = state.products.find((p) => p.id === replaceNewArrivalId);
          if (!toRemove || !toRemove.isNewArrival) return;
          toRemove.isNewArrival = false;
          target.isNewArrival = true;
        } else {
          // Turning new arrival OFF requires selecting another product
          if (!replaceNewArrivalId || replaceNewArrivalId === id) return;
          const toAdd = state.products.find((p) => p.id === replaceNewArrivalId);
          if (!toAdd || toAdd.isNewArrival) return;
          toAdd.isNewArrival = true;
          target.isNewArrival = false;
        }
      }

      // Apply scalar updates
      if (typeof updates.name === "string") target.name = updates.name;
      if (typeof updates.description === "string") target.description = updates.description;
      if (typeof updates.category === "string") target.category = updates.category;
      if (typeof updates.categoryId === "string") target.categoryId = updates.categoryId;
      if (typeof updates.price === "number") target.price = Math.max(0, updates.price);
      if (updates.originalPrice !== undefined) target.originalPrice = updates.originalPrice;
      if (typeof updates.stock === "number") {
        target.stock = Math.max(0, Math.floor(updates.stock));
        target.inStock = target.stock > 0;
      }
      if (updates.image) target.image = updates.image;
      if (updates.images) target.images = updates.images;
      if (updates.variants) target.variants = updates.variants;
      if (updates.tags) target.tags = updates.tags;

      // Recalculate derived pricing
      if (target.originalPrice && target.originalPrice > target.price) {
        target.discountPercent = Math.round(((target.originalPrice - target.price) / target.originalPrice) * 100);
      } else {
        target.discountPercent = undefined;
      }
    },

    deleteProduct: (state, action: PayloadAction<DeleteProductPayload>) => {
      // Invariant check: cannot delete if catalog would drop below 6
      if (state.products.length <= 6) {
        return;
      }

      const { id, replacements } = action.payload;
      const target = state.products.find((p) => p.id === id);
      if (!target) return;

      // If featured, replacement is required
      if (target.isFeatured) {
        const replacementId = replacements?.featuredReplacementId;
        if (!replacementId || replacementId === id) return;
        const replacement = state.products.find((p) => p.id === replacementId);
        if (!replacement || replacement.isFeatured) return;
        replacement.isFeatured = true;
      }

      // If new arrival, replacement is required
      if (target.isNewArrival) {
        const replacementId = replacements?.newArrivalReplacementId;
        if (!replacementId || replacementId === id) return;
        const replacement = state.products.find((p) => p.id === replacementId);
        if (!replacement || replacement.isNewArrival) return;
        replacement.isNewArrival = true;
      }

      state.products = state.products.filter((p) => p.id !== id);
    },

    setProductsState: (state, action: PayloadAction<ProductsState>) => {
      state.products = repairCollections(action.payload.products);
    },
  },
});

export const {
  swapFeatured,
  swapNewArrival,
  addProduct,
  updateProduct,
  deleteProduct,
  setProductsState,
} = productsSlice.actions;

export default productsSlice.reducer;

