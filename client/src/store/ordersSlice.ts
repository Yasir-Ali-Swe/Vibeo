import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { ORDERS } from "@/constants/orders";
import type { Order, OrderItem, OrderStatus, ShippingAddress } from "@/types/order";
import type { NotificationType } from "@/types/notification";
import { addNotification } from "./notificationsSlice";
import type { RootState } from "./index";

export interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: ORDERS,
};

export interface PlaceOrderPayload {
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderStatusPayload {
  id: string;
  status: OrderStatus;
  cancelReason?: string;
}

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<PlaceOrderPayload>) => {
      const orderCount = state.orders.length + 1;
      const orderNumber = `TRV-${10540 + orderCount}`;
      const newOrder: Order = {
        id: `ord-${10540 + orderCount}`,
        orderNumber,
        status: "pending",
        placedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.orders.unshift(newOrder);
    },

    updateOrderStatus: (state, action: PayloadAction<UpdateOrderStatusPayload>) => {
      const { id, status, cancelReason } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (!order) return;

      order.status = status;
      order.updatedAt = new Date().toISOString();

      if (status === "cancelled") {
        order.cancelReason = cancelReason?.trim() || "Cancelled by store";
      } else {
        order.cancelReason = undefined;
      }
    },

    cancelOrder: (
      state,
      action: PayloadAction<{ id: string; reason?: string }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = "cancelled";
        order.updatedAt = new Date().toISOString();
        order.cancelReason = action.payload.reason || "Cancelled by customer";
      }
    },

    setOrdersState: (state, action: PayloadAction<OrdersState>) => {
      state.orders = action.payload.orders;
    },
  },
});

export const { placeOrder, updateOrderStatus, cancelOrder, setOrdersState } = ordersSlice.actions;

export const updateOrderStatusAndNotify = createAsyncThunk<
  void,
  UpdateOrderStatusPayload,
  { state: RootState }
>("orders/updateOrderStatusAndNotify", ({ id, status, cancelReason }, { dispatch, getState }) => {
  const state = getState();
  const order = state.orders?.orders?.find((o) => o.id === id);
  if (!order || order.status === status) return;

  dispatch(updateOrderStatus({ id, status, cancelReason }));

  const notifType: NotificationType = status === "shipped" ? "shipping" : "order";
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const title = `Order #${order.orderNumber} ${statusLabel}`;
  const message =
    status === "cancelled"
      ? `Order #${order.orderNumber} has been cancelled: ${cancelReason || "Cancelled by store"}.`
      : `Your order #${order.orderNumber} status has been updated to ${status}.`;

  dispatch(
    addNotification({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: notifType,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      route: `/orders/${order.id}`,
      actionLabel: "View order",
    })
  );
});

export default ordersSlice.reducer;
