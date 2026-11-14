import type { OrderStatus } from "@/types/order";
import { formatOrderDate } from "./date";
import { withAlpha } from "./color";

export type FilterKey = "all" | OrderStatus;

export const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#F59E0B" },
  processing: { label: "Processing", color: "#3B82F6" },
  shipped: { label: "Shipped", color: "#8B5CF6" },
  completed: { label: "Completed", color: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
};

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export { formatOrderDate, withAlpha };
