import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import type { OrderStatus } from "@/types/order";
import { STATUS_META } from "@/utils/orders";
import { useTheme, radius } from "@/theme";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export interface StatusBreakdownProps {
  counts: Record<OrderStatus, number>;
  onSelectStatus?: (status: OrderStatus) => void;
}

function StatusBreakdown({ counts, onSelectStatus }: StatusBreakdownProps) {
  const { colors } = useTheme();

  const total = ORDER_STATUSES.reduce(
    (sum, status) => sum + (counts[status] || 0),
    0
  );

  if (total === 0) {
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <Text style={{ color: colors.muted.foreground, fontSize: 13 }}>
          No orders recorded yet
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Segmented horizontal bar */}
      <View
        style={{
          height: 10,
          borderRadius: radius.full,
          overflow: "hidden",
          flexDirection: "row",
          backgroundColor: colors.surface.elevated,
        }}
      >
        {ORDER_STATUSES.map((status) => {
          const count = counts[status] || 0;
          if (count === 0) return null;
          return (
            <View
              key={status}
              style={{
                flex: count,
                backgroundColor: STATUS_META[status].color,
              }}
            />
          );
        })}
      </View>

      {/* Legend Rows */}
      <View style={{ marginTop: 16 }}>
        {ORDER_STATUSES.map((status) => {
          const count = counts[status] || 0;
          const share = total > 0 ? Math.round((count / total) * 100) : 0;
          const meta = STATUS_META[status];

          return (
            <Pressable
              key={status}
              onPress={() => onSelectStatus?.(status)}
              disabled={!onSelectStatus}
              accessibilityRole="button"
              accessibilityLabel={`${meta.label} orders: ${count} (${share}%)`}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 9,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: radius.full,
                    backgroundColor: meta.color,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    color: colors.foreground.DEFAULT,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {meta.label}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.foreground.DEFAULT,
                    fontSize: 13,
                    fontWeight: "700",
                    marginRight: 10,
                  }}
                >
                  {count}
                </Text>
                <Text
                  style={{
                    color: colors.muted.foreground,
                    fontSize: 12,
                    fontWeight: "500",
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {share}%
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default memo(StatusBreakdown);

