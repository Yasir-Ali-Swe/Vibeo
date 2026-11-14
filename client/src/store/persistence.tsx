import { useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Middleware, Dispatch, UnknownAction } from "@reduxjs/toolkit";
import type { CartState } from "@/types/cart";
import type { WishlistState } from "@/types/wishlist";
import type { ProductsState } from "./productsSlice";
import type { OrdersState } from "./ordersSlice";
import type { SessionState } from "./sessionSlice";
import { setCartState } from "./cartSlice";
import { setWishlistState } from "./wishlistSlice";
import { setProductsState } from "./productsSlice";
import { setOrdersState } from "./ordersSlice";
import { setSessionState } from "./sessionSlice";
import { useAppDispatch } from "./hooks";

const STORAGE_KEY_V1 = "@vibeo_ecommerce_store_v1";
const STORAGE_KEY = "@vibeo_ecommerce_store_v2";
const CURRENT_VERSION = 2;

interface PersistedPayloadV1 {
  version: number;
  cart: CartState;
  wishlist: WishlistState;
}

interface PersistedPayloadV2 {
  version: number;
  session?: SessionState;
  products?: ProductsState;
  orders?: OrdersState;
  cart: CartState;
  wishlist: WishlistState;
}

interface PersistedStoreState {
  session: SessionState;
  products: ProductsState;
  orders: OrdersState;
  cart: CartState;
  wishlist: WishlistState;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const persistenceMiddleware: Middleware<object, PersistedStoreState> =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    const actionType = (action as { type?: string }).type || "";
    if (
      actionType.startsWith("cart/") ||
      actionType.startsWith("wishlist/") ||
      actionType.startsWith("products/") ||
      actionType.startsWith("orders/") ||
      actionType.startsWith("session/")
    ) {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(async () => {
        try {
          const state = storeApi.getState();
          const payload: PersistedPayloadV2 = {
            version: CURRENT_VERSION,
            session: state.session,
            products: state.products,
            orders: state.orders,
            cart: state.cart,
            wishlist: state.wishlist,
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
          // Ignore persistence errors quietly
        }
      }, 100);
    }

    return result;
  };

export async function rehydrateStore(dispatch: Dispatch<UnknownAction>): Promise<void> {
  try {
    // 1. Check for current v2 store
    const rawV2 = await AsyncStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const data: PersistedPayloadV2 = JSON.parse(rawV2);
      if (data && data.version === CURRENT_VERSION) {
        if (data.cart && Array.isArray(data.cart.items)) {
          dispatch(setCartState(data.cart));
        }
        if (data.wishlist && Array.isArray(data.wishlist.items)) {
          dispatch(setWishlistState(data.wishlist));
        }
        if (data.products && Array.isArray(data.products.products)) {
          dispatch(setProductsState(data.products));
        }
        if (data.orders && Array.isArray(data.orders.orders)) {
          dispatch(setOrdersState(data.orders));
        }
        if (data.session && data.session.user) {
          dispatch(setSessionState(data.session));
        }
        return;
      }
    }

    // 2. Migration from v1: preserve cart and wishlist
    const rawV1 = await AsyncStorage.getItem(STORAGE_KEY_V1);
    if (rawV1) {
      const dataV1: PersistedPayloadV1 = JSON.parse(rawV1);
      if (dataV1 && dataV1.cart && Array.isArray(dataV1.cart.items)) {
        dispatch(setCartState(dataV1.cart));
      }
      if (dataV1 && dataV1.wishlist && Array.isArray(dataV1.wishlist.items)) {
        dispatch(setWishlistState(dataV1.wishlist));
      }
    }
  } catch {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => { });
  }
}

interface StorePersistGateProps {
  children: ReactNode;
}

export function StorePersistGate({ children }: StorePersistGateProps) {
  const dispatch = useAppDispatch();
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await rehydrateStore(dispatch);
      } finally {
        if (active) {
          setRehydrated(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [dispatch]);

  if (!rehydrated) {
    return null;
  }

  return <>{children}</>;
}
