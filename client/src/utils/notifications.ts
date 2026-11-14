import type { AppNotification, NotificationType } from "@/types/notification";
import { formatTimeAgo } from "./date";

export type NotificationFilterKey = "all" | "new" | "unread";

export const NOTIFICATION_FILTERS: { key: NotificationFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "unread", label: "Unread" },
];

export const TYPE_COLOR: Record<NotificationType, string> = {
  order: "#3B82F6",
  shipping: "#8B5CF6",
  offer: "#F59E0B",
  system: "#22C55E",
};

const DAY_MS = 24 * 60 * 60 * 1000;

// "New" means received in the last 24 hours
export function isNewNotification(n: AppNotification): boolean {
  return Date.now() - new Date(n.createdAt).getTime() < DAY_MS;
}

export { formatTimeAgo };
