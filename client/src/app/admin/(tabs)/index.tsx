import { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Sparkles,
} from "lucide-react-native";

import { useTheme, radius } from "@/theme";
import { formatPrice } from "@/utils/format";
import {
  useAppSelector,
  selectCurrentUser,
  selectCompletedRevenue,
  selectOrders,
  selectOrdersToday,
  selectAdminOrdersCounts,
  selectRecentOrders,
  selectLowStockProducts,
  selectLowStockCount,
  selectFeaturedCount,
  selectNewArrivalCount,
} from "@/store";
import KpiCard from "@/components/admin/KpiCard";
import StatusBreakdown from "@/components/admin/StatusBreakdown";
import SectionCard from "@/components/admin/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatOrderDate } from "@/utils/date";
import type { OrderStatus } from "@/types/order";

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);

  const revenue = useAppSelector(selectCompletedRevenue);
  const allOrders = useAppSelector(selectOrders);
  const ordersToday = useAppSelector(selectOrdersToday);
  const orderCounts = useAppSelector(selectAdminOrdersCounts);
  const recentOrders = useAppSelector(selectRecentOrders(5));
  const lowStockProducts = useAppSelector(selectLowStockProducts);
  const lowStockCount = useAppSelector(selectLowStockCount);
  const featuredCount = useAppSelector(selectFeaturedCount);
  const newArrivalCount = useAppSelector(selectNewArrivalCount);

  const pendingCount = orderCounts.pending || 0;

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const handleStatusSelect = (status: OrderStatus) => {
    router.push({
      pathname: "/admin/orders",
      params: { status },
    });
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
      {/* Header Block */}
      <View style={{ marginBottom: 18 }}>
        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 24,
            fontWeight: "800",
            letterSpacing: -0.6,
          }}
        >
          Overview
        </Text>
        <Text
          style={{
            color: colors.muted.foreground,
            fontSize: 13,
            marginTop: 3,
          }}
        >
          {todayFormatted} · Welcome, {currentUser.name}
        </Text>
      </View>

      {/* KPI Grid (Exactly 4 Cards in 2 Columns) */}
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <KpiCard
            label="Revenue"
            value={formatPrice(revenue)}
            subline="Completed orders"
            icon={DollarSign}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <KpiCard
            label="Total Orders"
            value={String(allOrders.length)}
            subline={`${ordersToday} placed today`}
            icon={ShoppingBag}
            onPress={() => router.push("/admin/orders")}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <KpiCard
            label="Pending Orders"
            value={String(pendingCount)}
            subline={pendingCount > 0 ? "Needs action" : "All caught up"}
            icon={Clock}
            tone={pendingCount > 0 ? "warning" : "default"}
            onPress={() =>
              router.push({
                pathname: "/admin/orders",
                params: { status: "pending" },
              })
            }
          />
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <KpiCard
            label="Low Stock"
            value={String(lowStockCount)}
            subline={lowStockCount > 0 ? "5 or fewer units left" : "Healthy levels"}
            icon={AlertTriangle}
            tone={lowStockCount > 0 ? "warning" : "default"}
            onPress={() =>
              router.push({
                pathname: "/admin/products",
                params: { filter: "low-stock" },
              })
            }
          />
        </View>
      </View>

      {/* Status Breakdown Card */}
      <SectionCard title="Orders by Status">
        <StatusBreakdown
          counts={orderCounts}
          onSelectStatus={handleStatusSelect}
        />
      </SectionCard>

      {/* Collections Health Card (Featured 6/6 & New Arrivals 6/6) */}
      <SectionCard
        title="Homepage Collections"
        actionText="Manage"
        onAction={() => router.push("/admin/products/collections")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.DEFAULT,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Sparkles size={16} color={colors.primary.DEFAULT} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "600" }}>
              Featured Products
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: radius.full,
              backgroundColor: colors.surface.elevated,
            }}
          >
            <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontWeight: "700" }}>
              {featuredCount} / 6
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Sparkles size={16} color={colors.success.DEFAULT} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "600" }}>
              New Arrivals
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: radius.full,
              backgroundColor: colors.surface.elevated,
            }}
          >
            <Text style={{ color: colors.success.DEFAULT, fontSize: 12, fontWeight: "700" }}>
              {newArrivalCount} / 6
            </Text>
          </View>
        </View>
      </SectionCard>

      {/* Recent Orders Card */}
      <SectionCard
        title="Recent Orders"
        actionText="View all"
        onAction={() => router.push("/admin/orders")}
      >
        {recentOrders.length === 0 ? (
          <Text style={{ color: colors.muted.foreground, fontSize: 13, paddingVertical: 8 }}>
            No recent orders found.
          </Text>
        ) : (
          recentOrders.map((order, idx) => {
            const customerName = order.shippingAddress?.name || "Customer";
            return (
              <Pressable
                key={order.id}
                onPress={() => router.push({ pathname: "/admin/orders/[id]", params: { id: order.id } })}
                accessibilityRole="button"
                accessibilityLabel={`Order ${order.orderNumber}, ${customerName}`}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 11,
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderTopColor: colors.border.DEFAULT,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: colors.foreground.DEFAULT, fontSize: 13, fontWeight: "700" }}>
                    #{order.orderNumber} · {customerName}
                  </Text>
                  <Text style={{ color: colors.muted.foreground, fontSize: 11, marginTop: 2 }}>
                    {formatOrderDate(order.placedAt)} · {formatPrice(order.total)}
                  </Text>
                </View>

                <StatusBadge status={order.status} />
              </Pressable>
            );
          })
        )}
      </SectionCard>

      {/* Low Stock Card (Hidden if lowStockCount is 0) */}
      {lowStockCount > 0 && (
        <SectionCard
          title="Low Stock Items"
          actionText="View all"
          onAction={() =>
            router.push({
              pathname: "/admin/products",
              params: { filter: "low-stock" },
            })
          }
        >
          {lowStockProducts.slice(0, 5).map((product, idx) => (
            <Pressable
              key={product.id}
              onPress={() =>
                router.push({
                  pathname: "/admin/products/[id]",
                  params: { id: product.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`${product.name}, stock ${product.stock ?? 0}`}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 11,
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: colors.border.DEFAULT,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.foreground.DEFAULT,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {product.name}
                </Text>
                <Text style={{ color: colors.muted.foreground, fontSize: 11, marginTop: 2 }}>
                  {product.category || "General"} · {formatPrice(product.price)}
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: radius.full,
                  backgroundColor:
                    (product.stock ?? 0) === 0
                      ? colors.destructive.DEFAULT
                      : colors.warning.DEFAULT,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {(product.stock ?? 0) === 0 ? "Out of stock" : `${product.stock} left`}
                </Text>
              </View>
            </Pressable>
          ))}
        </SectionCard>
      )}
    </ScrollView>
  );
}
