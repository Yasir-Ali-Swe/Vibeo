import { createSelector } from "@reduxjs/toolkit";
import type { Order } from "@/types/order";
import { FILTERS, type FilterKey } from "@/utils/orders";
import type { OrdersState } from "./ordersSlice";
import type { RootState } from "./index";

const ACTIVE_STATUSES = ["pending", "processing", "shipped"];

const selectOrdersState = (state: RootState): OrdersState => state.orders;

export const selectOrders = createSelector(
  selectOrdersState,
  (state: OrdersState): Order[] => state?.orders ?? []
);

export const selectAllOrdersNewestFirst = createSelector(
  selectOrders,
  (orders: Order[]): Order[] =>
    [...orders].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
    )
);

export const selectAdminOrdersCounts = createSelector(
  selectOrders,
  (orders: Order[]): Record<FilterKey, number> =>
    FILTERS.reduce(
      (acc: Record<FilterKey, number>, f) => ({
        ...acc,
        [f.key]:
          f.key === "all"
            ? orders.length
            : orders.filter((o: Order) => o.status === f.key).length,
      }),
      {} as Record<FilterKey, number>
    )
);

export const selectOrdersCounts = selectAdminOrdersCounts;

const recentOrdersCache = new Map<number, (state: RootState) => Order[]>();

export const selectRecentOrders = (limit: number = 5) => {
  let selector = recentOrdersCache.get(limit);
  if (!selector) {
    selector = createSelector(
      selectAllOrdersNewestFirst,
      (orders: Order[]): Order[] => orders.slice(0, limit)
    );
    recentOrdersCache.set(limit, selector);
  }
  return selector;
};

export const selectCompletedRevenue = createSelector(
  selectOrders,
  (orders: Order[]): number =>
    orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.total || 0), 0)
);

export const selectOrdersToday = createSelector(
  selectOrders,
  (orders: Order[]): number => {
    const today = new Date().toISOString().slice(0, 10);
    return orders.filter((o) => o.placedAt?.startsWith(today)).length;
  }
);

// Customer-scoped selectors
const customerOrdersCache = new Map<string, (state: RootState) => Order[]>();

export const selectCustomerOrders = (customerId: string) => {
  if (!customerId) return () => [];
  let selector = customerOrdersCache.get(customerId);
  if (!selector) {
    selector = createSelector(
      selectAllOrdersNewestFirst,
      (orders: Order[]): Order[] =>
        orders.filter((o) => o.customerId === customerId)
    );
    customerOrdersCache.set(customerId, selector);
  }
  return selector;
};

const customerOrdersCountsCache = new Map<string, (state: RootState) => Record<FilterKey, number>>();

export const selectCustomerOrdersCounts = (customerId: string) => {
  if (!customerId) return () => FILTERS.reduce((acc, f) => ({ ...acc, [f.key]: 0 }), {} as Record<FilterKey, number>);
  let selector = customerOrdersCountsCache.get(customerId);
  if (!selector) {
    selector = createSelector(
      selectCustomerOrders(customerId),
      (orders: Order[]): Record<FilterKey, number> =>
        FILTERS.reduce(
          (acc: Record<FilterKey, number>, f) => ({
            ...acc,
            [f.key]:
              f.key === "all"
                ? orders.length
                : orders.filter((o: Order) => o.status === f.key).length,
          }),
          {} as Record<FilterKey, number>
        )
    );
    customerOrdersCountsCache.set(customerId, selector);
  }
  return selector;
};

const customerTotalCache = new Map<string, (state: RootState) => number>();
export const selectCustomerTotalOrdersCount = (customerId: string) => {
  let selector = customerTotalCache.get(customerId);
  if (!selector) {
    selector = createSelector(
      selectCustomerOrders(customerId),
      (orders: Order[]): number => orders.length
    );
    customerTotalCache.set(customerId, selector);
  }
  return selector;
};

const customerActiveCache = new Map<string, (state: RootState) => number>();
export const selectCustomerActiveOrdersCount = (customerId: string) => {
  let selector = customerActiveCache.get(customerId);
  if (!selector) {
    selector = createSelector(
      selectCustomerOrders(customerId),
      (orders: Order[]): number =>
        orders.filter((o: Order) => ACTIVE_STATUSES.includes(o.status)).length
    );
    customerActiveCache.set(customerId, selector);
  }
  return selector;
};

const customerCompletedCache = new Map<string, (state: RootState) => number>();
export const selectCustomerCompletedOrdersCount = (customerId: string) => {
  let selector = customerCompletedCache.get(customerId);
  if (!selector) {
    selector = createSelector(
      selectCustomerOrders(customerId),
      (orders: Order[]): number =>
        orders.filter((o: Order) => o.status === "completed").length
    );
    customerCompletedCache.set(customerId, selector);
  }
  return selector;
};

// Legacy customer selectors (maintain backwards compatibility for customer screens)
export const selectTotalOrdersCount = createSelector(
  selectCustomerOrders("usr-dev-1"),
  (orders: Order[]): number => orders.length
);

export const selectActiveOrdersCount = createSelector(
  selectCustomerOrders("usr-dev-1"),
  (orders: Order[]): number =>
    orders.filter((o: Order) => ACTIVE_STATUSES.includes(o.status)).length
);

export const selectCompletedOrdersCount = createSelector(
  selectCustomerOrders("usr-dev-1"),
  (orders: Order[]): number =>
    orders.filter((o: Order) => o.status === "completed").length
);

const orderByIdCache = new Map<string, (state: RootState) => Order | null>();

export const selectOrderById = (id: string) => {
  if (!id) return () => null;
  let selector = orderByIdCache.get(id);
  if (!selector) {
    selector = createSelector(
      selectOrders,
      (orders: Order[]): Order | null =>
        orders.find((o: Order) => o.id === id) ?? null
    );
    orderByIdCache.set(id, selector);
  }
  return selector;
};
