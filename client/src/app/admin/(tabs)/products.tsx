import { useState, useMemo, useEffect, useCallback } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { Plus, Sparkles, PackageOpen } from "lucide-react-native";

import { useTheme, radius } from "@/theme";
import {
  useAppSelector,
  useAppDispatch,
  selectAllProducts,
  selectFeaturedProducts,
  selectNewArrivalProducts,
  deleteProduct,
} from "@/store";
import type { Product } from "@/types/product";
import { usePagination } from "@/hooks/usePagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import SearchField from "@/components/admin/SearchField";
import FilterChips, { type FilterItem } from "@/components/admin/FilterChips";
import ProductRow from "@/components/admin/ProductRow";
import PaginationBar from "@/components/admin/PaginationBar";
import AdminTable from "@/components/admin/AdminTable";
import CollectionSwapSheet from "@/components/admin/CollectionSwapSheet";

type StockFilterKey = "all" | "in-stock" | "low-stock" | "out-of-stock";
type CollectionFilterKey = "all" | "featured" | "new-arrivals";

const STOCK_FILTERS: FilterItem<StockFilterKey>[] = [
  { key: "all", label: "All Stock" },
  { key: "in-stock", label: "In Stock" },
  { key: "low-stock", label: "Low Stock (≤5)" },
  { key: "out-of-stock", label: "Out of Stock" },
];

const COLLECTION_FILTERS: FilterItem<CollectionFilterKey>[] = [
  { key: "all", label: "All Items" },
  { key: "featured", label: "Featured" },
  { key: "new-arrivals", label: "New Arrivals" },
];

export default function AdminProductsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ filter?: string }>();

  const allProducts = useAppSelector(selectAllProducts);
  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const newArrivalProducts = useAppSelector(selectNewArrivalProducts);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText, 250);

  const initialStockFilter: StockFilterKey =
    params.filter === "low-stock"
      ? "low-stock"
      : params.filter === "out-of-stock"
        ? "out-of-stock"
        : "all";

  const [stockFilter, setStockFilter] = useState<StockFilterKey>(initialStockFilter);
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilterKey>("all");

  // Deletion swap sheet state if product being deleted belongs to a collection
  const [deleteSwapTarget, setDeleteSwapTarget] = useState<{
    product: Product;
    collection: "Featured" | "New arrival";
    featuredReplacementId?: string;
  } | null>(null);

  // Set up header right "+" button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push("/admin/products/new")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add new product"
          style={{
            marginRight: 16,
            width: 34,
            height: 34,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={18} color={colors.primary.foreground} strokeWidth={2.5} />
        </Pressable>
      ),
    });
  }, [navigation, colors]);

  // Compute stock filter counts
  const stockCounts = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    for (const p of allProducts) {
      const stock = p.stock ?? 0;
      if (stock === 0) outOfStock++;
      else if (stock <= 5) lowStock++;
      else inStock++;
    }

    return {
      all: allProducts.length,
      "in-stock": inStock,
      "low-stock": lowStock,
      "out-of-stock": outOfStock,
    };
  }, [allProducts]);

  // Compute collection filter counts
  const collectionCounts = useMemo(() => {
    return {
      all: allProducts.length,
      featured: featuredProducts.length,
      "new-arrivals": newArrivalProducts.length,
    };
  }, [allProducts, featuredProducts, newArrivalProducts]);

  // Filter products by search, stock, and collection
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Search text filter
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = product.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory) return false;
      }

      // 2. Stock filter
      const stock = product.stock ?? 0;
      if (stockFilter === "in-stock" && stock <= 5) return false;
      if (stockFilter === "low-stock" && (stock === 0 || stock > 5)) return false;
      if (stockFilter === "out-of-stock" && stock > 0) return false;

      // 3. Collection filter
      if (collectionFilter === "featured" && !product.isFeatured) return false;
      if (collectionFilter === "new-arrivals" && !product.isNewArrival) return false;

      return true;
    });
  }, [allProducts, debouncedSearch, stockFilter, collectionFilter]);

  // Pagination hook
  const {
    page,
    setPage,
    pageCount,
    pageItems,
    total,
    pageSize,
    reset,
  } = usePagination(filteredProducts, 10);

  // Reset page when filters change
  useEffect(() => {
    reset();
  }, [debouncedSearch, stockFilter, collectionFilter, reset]);

  const handleStockFilterChange = (key: StockFilterKey) => {
    setStockFilter(key);
  };

  const handleCollectionFilterChange = (key: CollectionFilterKey) => {
    setCollectionFilter(key);
  };

  const executeDelete = useCallback(
    (product: Product, replacements?: { featuredReplacementId?: string; newArrivalReplacementId?: string }) => {
      dispatch(deleteProduct({ id: product.id, replacements }));
    },
    [dispatch]
  );

  const handleDeleteProduct = useCallback(
    (product: Product) => {
      if (allProducts.length <= 6) {
        Alert.alert(
          "Cannot Delete Product",
          "The catalog cannot drop below 6 products because Featured and New Arrivals require exactly 6 slots."
        );
        return;
      }

      if (product.isFeatured) {
        setDeleteSwapTarget({ product, collection: "Featured" });
        return;
      }

      if (product.isNewArrival) {
        setDeleteSwapTarget({ product, collection: "New arrival" });
        return;
      }

      Alert.alert(
        "Delete Product",
        `Are you sure you want to delete "${product.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => executeDelete(product),
          },
        ]
      );
    },
    [allProducts.length, executeDelete]
  );

  const handleConfirmDeleteSwap = (replacementId: string) => {
    if (!deleteSwapTarget) return;
    const { product, collection, featuredReplacementId } = deleteSwapTarget;

    if (collection === "Featured" && product.isNewArrival) {
      // Still needs new arrival replacement
      setDeleteSwapTarget({
        product,
        collection: "New arrival",
        featuredReplacementId: replacementId,
      });
      return;
    }

    const replacements = {
      featuredReplacementId: featuredReplacementId || (collection === "Featured" ? replacementId : undefined),
      newArrivalReplacementId: collection === "New arrival" ? replacementId : undefined,
    };

    executeDelete(product, replacements);
    setDeleteSwapTarget(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AdminTable
        data={pageItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 14 }}>
            {/* Homepage Collections Manager Banner Link */}
            <Pressable
              onPress={() => router.push("/admin/products/collections")}
              accessibilityRole="button"
              accessibilityLabel="Manage homepage collections"
              style={({ pressed }) => ({
                marginHorizontal: 16,
                marginBottom: 14,
                padding: 12,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border.DEFAULT,
                backgroundColor: pressed ? colors.surface.elevated : colors.card.DEFAULT,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Sparkles size={16} color={colors.primary.DEFAULT} style={{ marginRight: 8 }} />
                <Text style={{ color: colors.foreground.DEFAULT, fontSize: 13, fontWeight: "700" }}>
                  Homepage Collections
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: colors.muted.foreground, fontSize: 12, marginRight: 6 }}>
                  Featured 6/6 · New 6/6
                </Text>
                <Text style={{ color: colors.primary.DEFAULT, fontSize: 12, fontWeight: "700" }}>
                  Manage →
                </Text>
              </View>
            </Pressable>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
              <SearchField
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search products by name or category..."
              />
            </View>

            {/* Stock Filters */}
            <FilterChips
              filters={STOCK_FILTERS}
              value={stockFilter}
              onChange={handleStockFilterChange}
              counts={stockCounts}
            />

            {/* Collection Filters */}
            <FilterChips
              filters={COLLECTION_FILTERS}
              value={collectionFilter}
              onChange={handleCollectionFilterChange}
              counts={collectionCounts}
            />
          </View>
        }
        renderRow={(item) => (
          <ProductRow
            product={item}
            onPress={() =>
              router.push({
                pathname: "/admin/products/[id]",
                params: { id: item.id },
              })
            }
            onEdit={() =>
              router.push({
                pathname: "/admin/products/[id]",
                params: { id: item.id },
              })
            }
            onDelete={() => handleDeleteProduct(item)}
          />
        )}
        emptyState={
          <View style={{ alignItems: "center", paddingVertical: 24 }}>
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
              <PackageOpen size={26} color={colors.muted.subtle} strokeWidth={1.75} />
            </View>
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 6,
              }}
            >
              No products found
            </Text>
            <Text
              style={{
                color: colors.muted.foreground,
                fontSize: 13,
                textAlign: "center",
                maxWidth: 240,
                marginBottom: 16,
              }}
            >
              No products match your search or active filter criteria.
            </Text>
            <Pressable
              onPress={() => router.push("/admin/products/new")}
              accessibilityRole="button"
              accessibilityLabel="Add new product"
              style={{
                height: 40,
                paddingHorizontal: 16,
                borderRadius: radius.md,
                backgroundColor: colors.primary.DEFAULT,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.primary.foreground,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                Add product
              </Text>
            </Pressable>
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

      {/* Delete replacement picker modal */}
      {deleteSwapTarget && (
        <CollectionSwapSheet
          visible={true}
          onClose={() => setDeleteSwapTarget(null)}
          collectionName={deleteSwapTarget.collection}
          mode="choose_replacement"
          currentMembers={
            deleteSwapTarget.collection === "Featured"
              ? featuredProducts
              : newArrivalProducts
          }
          candidateProducts={allProducts.filter(
            (p) =>
              p.id !== deleteSwapTarget.product.id &&
              (deleteSwapTarget.collection === "Featured"
                ? !featuredProducts.some((f) => f.id === p.id)
                : !newArrivalProducts.some((n) => n.id === p.id))
          )}
          onConfirm={handleConfirmDeleteSwap}
        />
      )}
    </View>
  );
}

