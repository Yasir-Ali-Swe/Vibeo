import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { Order } from "@/types/order";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTheme } from "@/theme";
import { formatPrice } from "@/utils/format";
import { formatOrderDate } from "@/utils/date";

export interface OrderRowProps {
  order: Order;
  onPress: () => void;
}

function OrderRow({ order, onPress }: OrderRowProps) {
  const { colors } = useTheme();

  const itemCount = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const customerName = order.shippingAddress?.name || "Customer";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.orderNumber}, ${customerName}, ${order.status}, ${formatPrice(order.total)}`}
      style={({ pressed }) => ({
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.DEFAULT,
        backgroundColor: pressed ? colors.surface.elevated : colors.card.DEFAULT,
        flexDirection: "row",
        alignItems: "center",
      })}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              color: colors.foreground.DEFAULT,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            #{order.orderNumber}
          </Text>

          <StatusBadge status={order.status} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: colors.foreground.DEFAULT,
              fontSize: 13,
              fontWeight: "500",
              flex: 1,
              marginRight: 8,
            }}
          >
            {customerName}
          </Text>

          <Text
            style={{
              color: colors.muted.foreground,
              fontSize: 12,
            }}
          >
            {formatOrderDate(order.placedAt)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: colors.muted.foreground,
              fontSize: 12,
            }}
          >
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Text>

          <Text
            style={{
              color: colors.foreground.DEFAULT,
              fontSize: 14,
              fontWeight: "800",
            }}
          >
            {formatPrice(order.total)}
          </Text>
        </View>
      </View>

      <ChevronRight size={18} color={colors.muted.subtle} strokeWidth={2} />
    </Pressable>
  );
}

export default memo(OrderRow);

