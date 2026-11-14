import type { Href } from "expo-router";

export type NotificationType = "order" | "shipping" | "offer" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date
  read: boolean;
  route?: Href; // optional screen to open, e.g. "/orders/ord-10541"
  actionLabel?: string; // button label shown when expanded
}
