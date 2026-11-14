import { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PackageOpen } from "lucide-react-native";

import OrderCard from "@/components/orders/OrderCard";
import OrderStatusFilter from "@/components/orders/OrderStatusFilter";
import {
  useAppSelector,
  selectCurrentUser,
  selectCustomerOrders,
  selectCustomerOrdersCounts,
} from "@/store";
import { useTheme, radius } from "@/theme";
import type { Order } from "@/types/order";
import { STATUS_META, type FilterKey } from "@/utils/orders";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [filter, setFilter] = useState<FilterKey>("all");

  const currentUser = useAppSelector(selectCurrentUser);
  const orders = useAppSelector(selectCustomerOrders(currentUser.id));
  const counts = useAppSelector(selectCustomerOrdersCounts(currentUser.id));

  const data = useMemo(
    () => (filter === "all" ? orders : orders.filter((o: Order) => o.status === filter)),
    [filter, orders]
  );

  const emptyLabel =
    filter === "all" ? "No orders yet" : `No ${STATUS_META[filter].label.toLowerCase()} orders`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <OrderStatusFilter value={filter} onChange={setFilter} counts={counts} />

      <FlatList
        data={data}
        keyExtractor={(order) => order.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              router.push({ pathname: "/orders/[id]", params: { id: item.id } })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 16) + 16,
        }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surface.DEFAULT,
                borderWidth: 1,
                borderColor: colors.border.strong,
                marginBottom: 16,
              }}
            >
              <PackageOpen size={28} color={colors.muted.subtle} strokeWidth={1.75} />
            </View>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 16, fontWeight: "700" }}>
              {emptyLabel}
            </Text>
            <Text
              style={{
                color: colors.muted.foreground,
                fontSize: 13,
                textAlign: "center",
                marginTop: 6,
                maxWidth: 240,
                lineHeight: 19,
              }}
            >
              Orders you place will show up here.
            </Text>
          </View>
        }
      />
    </View>
  );
}