export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variants?: Record<string, string>;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  status: OrderStatus;
  placedAt: string; // ISO date
  updatedAt?: string; // ISO date
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  cancelReason?: string;
}
