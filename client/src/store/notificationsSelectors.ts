import { createSelector } from "@reduxjs/toolkit";
import type { AppNotification } from "@/types/notification";
import { isNewNotification } from "@/utils/notifications";
import type { NotificationsState } from "./notificationsSlice";
import type { RootState } from "./index";

const selectNotificationsState = (state: RootState): NotificationsState =>
  state.notifications;

export const selectNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState): AppNotification[] => state.notifications
);

export const selectUnreadNotificationsCount = createSelector(
  selectNotifications,
  (items: AppNotification[]): number => items.filter((n: AppNotification) => !n.read).length
);

export const selectNewNotificationsCount = createSelector(
  selectNotifications,
  (items: AppNotification[]): number => items.filter(isNewNotification).length
);

export const selectNotificationsCounts = createSelector(
  selectNotifications,
  (items: AppNotification[]) => ({
    all: items.length,
    new: items.filter(isNewNotification).length,
    unread: items.filter((n: AppNotification) => !n.read).length,
  })
);
