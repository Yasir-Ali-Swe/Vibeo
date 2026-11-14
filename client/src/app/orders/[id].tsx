import { View, Text, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, CreditCard, XCircle, PackageX } from "lucide-react-native";

import Card from "@/components/ui/Card";
import SummaryRow from "@/components/ui/SummaryRow";
import StatusBadge from "@/components/ui/StatusBadge";
import OrderTracker from "@/components/orders/OrderTracker";
import { useAppSelector, selectOrderById } from "@/store";
import { useTheme, radius } from "@/theme";
import { formatOrderDate } from "@/utils/date";
import { withAlpha } from "@/utils/color";
import { formatPrice } from "@/utils/format";

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<"/orders/[id]">();
  const orderId = Array.isArray(id) ? id[0] : id ?? "";
  const order = useAppSelector(selectOrderById(orderId));

  if (!order) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: colors.background,
        }}
      >
        <PackageX size={36} color={colors.muted.subtle} strokeWidth={1.5} />
        <Text style={{ color: colors.foreground.DEFAULT, fontSize: 16, fontWeight: "700", marginTop: 12 }}>
          Order not found
        </Text>
        <Text style={{ color: colors.muted.foreground, fontSize: 13, marginTop: 4, textAlign: "center" }}>
          This order doesn&apos;t exist or was removed.
        </Text>
      </View>
    );
  }

  const { shippingAddress: addr } = order;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: Math.max(insets.bottom, 16) + 24,
      }}
    >
      {/* Summary + progress */}
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 17, fontWeight: "800" }}>
              #{order.orderNumber}
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 3 }}>
              Placed on {formatOrderDate(order.placedAt)}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>

        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 16 }} />

        {order.status === "cancelled" ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: withAlpha(colors.destructive.DEFAULT, 0.15),
                marginRight: 12,
              }}
            >
              <XCircle size={20} color={colors.destructive.DEFAULT} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "700" }}>
                Order cancelled
              </Text>
              {order.cancelReason ? (
                <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 2 }}>
                  {order.cancelReason}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <OrderTracker status={order.status} />
        )}
      </Card>

      {/* Items */}
      <Card title={`Items (${order.items.length})`}>
        {order.items.map((item, index) => {
          const variantText = item.variants
            ? Object.entries(item.variants)
              .map(([key, value]) => `${key}: ${value}`)
              .join("  ·  ")
            : "";

          return (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                marginTop: index === 0 ? 0 : 14,
                paddingTop: index === 0 ? 0 : 14,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.border.DEFAULT,
              }}
            >
              <Image
                source={{ uri: item.image }}
                contentFit="cover"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: radius.sm,
                  backgroundColor: colors.surface.elevated,
                }}
              />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text
                  numberOfLines={2}
                  style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "600", lineHeight: 19 }}
                >
                  {item.name}
                </Text>
                {variantText ? (
                  <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 3 }}>
                    {variantText}
                  </Text>
                ) : null}
                <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 3 }}>
                  Qty {item.quantity} × {formatPrice(item.price)}
                </Text>
              </View>
              <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "700" }}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          );
        })}
      </Card>

      {/* Shipping address */}
      <Card title="Shipping address">
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.primary.DEFAULT, 0.15),
              marginRight: 12,
            }}
          >
            <MapPin size={19} color={colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "700" }}>
              {addr.name}
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 13, marginTop: 3 }}>
              {addr.phone}
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 13, marginTop: 3, lineHeight: 19 }}>
              {addr.address}, {addr.city}, {addr.state}, {addr.country}
            </Text>
          </View>
        </View>
      </Card>

      {/* Payment summary */}
      <Card title="Payment">
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.primary.DEFAULT, 0.15),
              marginRight: 12,
            }}
          >
            <CreditCard size={19} color={colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <View>
            <Text style={{ color: colors.muted.foreground, fontSize: 12 }}>Payment method</Text>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "600", marginTop: 2 }}>
              {order.paymentMethod}
            </Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginBottom: 14 }} />

        <SummaryRow topSpace={false} label="Subtotal" value={formatPrice(order.subtotal)} />
        <SummaryRow
          label="Shipping"
          value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
          valueColor={order.shipping === 0 ? colors.success.DEFAULT : undefined}
        />
        {order.discount > 0 && (
          <SummaryRow
            label="Discount"
            value={`- ${formatPrice(order.discount)}`}
            valueColor={colors.success.DEFAULT}
          />
        )}

        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 14 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.foreground.DEFAULT, fontSize: 15, fontWeight: "700" }}>
            Total
          </Text>
          <Text style={{ color: colors.foreground.DEFAULT, fontSize: 18, fontWeight: "800" }}>
            {formatPrice(order.total)}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}