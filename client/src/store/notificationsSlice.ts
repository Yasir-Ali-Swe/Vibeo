import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { NOTIFICATIONS } from "@/constants/notifications";
import type { AppNotification } from "@/types/notification";

export interface NotificationsState {
  notifications: AppNotification[];
}

const initialState: NotificationsState = {
  notifications: NOTIFICATIONS,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) {
        item.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.unshift(action.payload);
    },
  },
});

export const {
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

