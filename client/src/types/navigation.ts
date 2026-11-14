export type ProductCollectionType = "featured" | "new-arrivals" | "all";

export interface ProductsRouteParams {
  collection?: string;
  categoryId?: string;
  category?: string;
  title?: string;
}

export interface ProductDetailRouteParams {
  id: string;
}

export interface SearchRouteParams {
  initialQuery?: string;
}

export interface OrderDetailRouteParams {
  id: string;
}
