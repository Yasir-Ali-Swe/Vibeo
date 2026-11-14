import { View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { MapPin, CreditCard, XCircle, PackageX, User } from "lucide-react-native";

import Card from "@/components/ui/Card";
import SummaryRow from "@/components/ui/SummaryRow";
import StatusBadge from "@/components/ui/StatusBadge";
import OrderTracker from "@/components/orders/OrderTracker";
import StatusSelector from "@/components/admin/StatusSelector";
import {
  useAppDispatch,
  useAppSelector,
  selectOrderById,
  updateOrderStatusAndNotify,
} from "@/store";
import { useTheme, radius } from "@/theme";
import { formatOrderDate } from "@/utils/date";
import { withAlpha } from "@/utils/color";
import { formatPrice } from "@/utils/format";
import type { OrderStatus } from "@/types/order";

export default function AdminOrderDetailScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<"/admin/orders/[id]">();
  const orderId = Array.isArray(id) ? id[0] : id ?? "";

  const order = useAppSelector(selectOrderById(orderId));

  if (!order) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            backgroundColor: colors.surface.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <PackageX size={28} color={colors.muted.subtle} strokeWidth={1.75} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground.DEFAULT }}>
          Order not found
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.muted.foreground,
            textAlign: "center",
            marginTop: 6,
            marginBottom: 20,
            maxWidth: 240,
          }}
        >
          This order does not exist or has been removed.
        </Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to orders list"
          style={{
            height: 42,
            paddingHorizontal: 20,
            borderRadius: radius.md,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.primary.foreground, fontSize: 13, fontWeight: "700" }}>
            Return to orders
          </Text>
        </Pressable>
      </View>
    );
  }

  const { shippingAddress: addr } = order;

  const handleUpdateStatus = (newStatus: OrderStatus, cancelReason?: string) => {
    dispatch(
      updateOrderStatusAndNotify({
        id: order.id,
        status: newStatus,
        cancelReason,
      })
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
      }}
    >
      {/* Header Info Banner */}
      <View
        style={{
          padding: 16,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.card.DEFAULT,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: colors.foreground.DEFAULT, fontSize: 18, fontWeight: "800" }}>
            #{order.orderNumber}
          </Text>
          <StatusBadge status={order.status} />
        </View>

        <Text style={{ color: colors.muted.foreground, fontSize: 13 }}>
          Placed on {formatOrderDate(order.placedAt)}
        </Text>

        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 14 }} />

        {/* Tracker or Cancelled Banner */}
        {order.status === "cancelled" ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 38,
                height: 38,
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
              <Text style={{ color: colors.destructive.DEFAULT, fontSize: 14, fontWeight: "700" }}>
                Order Cancelled
              </Text>
              <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 2 }}>
                {order.cancelReason || "Cancelled by store"}
              </Text>
            </View>
          </View>
        ) : (
          <OrderTracker status={order.status} />
        )}
      </View>

      {/* Status Management Card */}
      <Card title="Update Order Status">
        <StatusSelector
          currentStatus={order.status}
          onUpdateStatus={handleUpdateStatus}
        />
      </Card>

      {/* Customer Card */}
      <Card title="Customer Information">
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.primary.DEFAULT, 0.15),
              marginRight: 12,
            }}
          >
            <User size={18} color={colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "700" }}>
              {addr?.name || "Customer"}
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 13, marginTop: 2 }}>
              {addr?.phone || "No phone provided"}
            </Text>
          </View>
        </View>
      </Card>

      {/* Items List */}
      <Card title={`Order Items (${order.items.length})`}>
        {order.items.map((item, index) => {
          const variantsText = item.variants
            ? Object.entries(item.variants)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")
            : null;

          return (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.border.DEFAULT,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radius.sm,
                  backgroundColor: colors.surface.DEFAULT,
                  marginRight: 12,
                }}
                contentFit="cover"
              />

              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.foreground.DEFAULT,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {item.name}
                </Text>
                {variantsText && (
                  <Text
                    style={{
                      color: colors.muted.foreground,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {variantsText}
                  </Text>
                )}
                <Text
                  style={{
                    color: colors.muted.foreground,
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  Qty: {item.quantity} · {formatPrice(item.price)} each
                </Text>
              </View>

              <Text
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          );
        })}
      </Card>

      {/* Shipping Address */}
      <Card title="Shipping Address">
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.primary.DEFAULT, 0.15),
              marginRight: 12,
            }}
          >
            <MapPin size={18} color={colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "700" }}>
              {addr.name}
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 13, marginTop: 2 }}>
              {addr.phone}
            </Text>
            <Text
              style={{
                color: colors.muted.foreground,
                fontSize: 13,
                marginTop: 2,
                lineHeight: 18,
              }}
            >
              {addr.address}, {addr.city}, {addr.state}, {addr.country}
            </Text>
          </View>
        </View>
      </Card>

      {/* Payment Summary */}
      <Card title="Payment">
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: withAlpha(colors.primary.DEFAULT, 0.15),
              marginRight: 12,
            }}
          >
            <CreditCard size={18} color={colors.primary.DEFAULT} strokeWidth={2} />
          </View>
          <View>
            <Text style={{ color: colors.muted.foreground, fontSize: 11 }}>Payment method</Text>
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 13,
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              {order.paymentMethod}
            </Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginBottom: 12 }} />

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

        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 12 }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

