import { useState, useMemo, useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ClipboardList } from "lucide-react-native";

import { useTheme, radius } from "@/theme";
import {
  useAppSelector,
  selectAllOrdersNewestFirst,
  selectAdminOrdersCounts,
} from "@/store";
import type { Order } from "@/types/order";
import { FILTERS, STATUS_META, type FilterKey } from "@/utils/orders";
import { usePagination } from "@/hooks/usePagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import SearchField from "@/components/admin/SearchField";
import FilterChips from "@/components/admin/FilterChips";
import OrderRow from "@/components/admin/OrderRow";
import PaginationBar from "@/components/admin/PaginationBar";
import AdminTable from "@/components/admin/AdminTable";

export default function AdminOrdersScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ status?: string }>();

  const allOrders = useAppSelector(selectAllOrdersNewestFirst);
  const statusCounts = useAppSelector(selectAdminOrdersCounts);

  const paramStatus: FilterKey =
    params.status && ["pending", "processing", "shipped", "completed", "cancelled"].includes(params.status)
      ? (params.status as FilterKey)
      : "all";

  const [userStatus, setUserStatus] = useState<FilterKey | null>(null);
  const [prevParamStatus, setPrevParamStatus] = useState<FilterKey>(paramStatus);

  if (paramStatus !== prevParamStatus) {
    setPrevParamStatus(paramStatus);
    setUserStatus(null);
  }

  const statusFilter: FilterKey = userStatus ?? paramStatus;
  const setStatusFilter = setUserStatus;

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText, 250);

  // Filter orders by search and status
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order: Order) => {
      // 1. Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // 2. Search filter (order number or customer name)
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesName = order.shippingAddress?.name.toLowerCase().includes(q);
        if (!matchesNumber && !matchesName) return false;
      }

      return true;
    });
  }, [allOrders, statusFilter, debouncedSearch]);

  // Pagination hook
  const {
    page,
    setPage,
    pageCount,
    pageItems,
    total,
    pageSize,
    reset,
  } = usePagination(filteredOrders, 10);

  // Reset page when filter or search changes
  useEffect(() => {
    reset();
  }, [debouncedSearch, statusFilter, reset]);

  const emptyLabel =
    statusFilter === "all"
      ? "No orders found"
      : `No ${STATUS_META[statusFilter].label.toLowerCase()} orders`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AdminTable
        data={pageItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 14 }}>
            {/* Search Bar */}
            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
              <SearchField
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search by order # or customer name..."
              />
            </View>

            {/* Status Filter Chips */}
            <FilterChips
              filters={FILTERS}
              value={statusFilter}
              onChange={setStatusFilter}
              counts={statusCounts}
            />
          </View>
        }
        renderRow={(item) => (
          <OrderRow
            order={item}
            onPress={() =>
              router.push({
                pathname: "/admin/orders/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        emptyState={
          <View style={{ alignItems: "center", paddingVertical: 36 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: radius.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surface.DEFAULT,
                borderWidth: 1,
                borderColor: colors.border.strong,
                marginBottom: 14,
              }}
            >
              <ClipboardList size={26} color={colors.muted.subtle} strokeWidth={1.75} />
            </View>
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 6,
              }}
            >
              {emptyLabel}
            </Text>
            <Text
              style={{
                color: colors.muted.foreground,
                fontSize: 13,
                textAlign: "center",
                maxWidth: 240,
              }}
            >
              No orders match the current search or status filter.
            </Text>
          </View>
        }
        footer={
          <PaginationBar
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={pageSize}
            onChange={setPage}
          />
        }
      />
    </View>
  );
}
