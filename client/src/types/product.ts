export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color"
  options: string[]; // e.g. ["S", "M", "L", "XL"]
}

export type SelectedVariants = Record<string, string>;

export interface Product {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: string;
  discountPercent?: number;
  rating?: number;
  reviewsCount?: number;
  /** @deprecated Use `reviewsCount` instead */
  ratingCount?: number;
  category?: string;
  categoryId?: string;
  badge?: string;
  /** @deprecated Use `isNewArrival` instead */
  isNew?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  description?: string;
  inStock?: boolean;
  stock?: number;
  variants?: ProductVariant[];
  tags?: string[];
}

export interface ProductSearchSuggestion {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryId?: string;
  price: number;
}
