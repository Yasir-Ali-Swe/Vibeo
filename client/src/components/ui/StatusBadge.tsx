import { View, Text } from "react-native";
import type { OrderStatus } from "@/types/order";
import { STATUS_META } from "@/utils/orders";
import { withAlpha } from "@/utils/color";
import { useTheme, radius } from "@/theme";

interface StatusBadgeProps {
  status: OrderStatus;
}

// In light mode, deeper text shades satisfy WCAG AA (>= 4.5:1) while preserving semantic meaning
const STATUS_TEXT_LIGHT: Record<OrderStatus, string> = {
  pending: "#B45309",
  processing: "#1D4ED8",
  shipped: "#6D28D9",
  completed: "#15803D",
  cancelled: "#DC2626",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { isDark } = useTheme();
  const { label, color: darkColor } = STATUS_META[status];
  const textColor = isDark ? darkColor : STATUS_TEXT_LIGHT[status];
  const bgColor = withAlpha(darkColor, isDark ? 0.15 : 0.12);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: radius.full,
        backgroundColor: bgColor,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: radius.full,
          backgroundColor: textColor,
          marginRight: 6,
        }}
      />
      <Text style={{ color: textColor, fontSize: 11, fontWeight: "700", letterSpacing: 0.2 }}>
        {label}
      </Text>
    </View>
  );
}

