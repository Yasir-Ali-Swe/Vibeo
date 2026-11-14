import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import ordersReducer from "./ordersSlice";
import notificationsReducer from "./notificationsSlice";
import { persistenceMiddleware } from "./persistence";

const rootReducer = {
  session: sessionReducer,
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: ordersReducer,
  notifications: notificationsReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useAppDispatch, useAppSelector } from "./hooks";
export * from "./sessionSlice";
export * from "./productsSlice";
export * from "./productsSelectors";
export * from "./cartSlice";
export * from "./cartSelectors";
export * from "./wishlistSlice";
export * from "./wishlistSelectors";
export * from "./ordersSlice";
export * from "./ordersSelectors";
export * from "./notificationsSlice";
export * from "./notificationsSelectors";
export { StorePersistGate } from "./persistence";
