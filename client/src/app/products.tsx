import { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, ArrowLeft, PackageOpen } from "lucide-react-native";

import ProductCategoryTabs from "@/components/products/ProductCategoryTabs";
import ProductCard from "@/components/products/ProductCard";
import { CATEGORIES } from "@/constants/categories";
import { useAppSelector, selectAllProducts } from "@/store";
import { useTheme } from "@/theme";
import type { Product } from "@/types/product";
export default function ProductsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<"/products">();

  const collectionParam = Array.isArray(params.collection)
    ? params.collection[0]
    : params.collection;
  const categoryIdParam = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId;
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const titleParam = Array.isArray(params.title)
    ? params.title[0]
    : params.title;

  // Validate collection parameter ("featured" | "new-arrivals" | "all")
  const activeCollection = useMemo(() => {
    const raw = collectionParam?.toLowerCase().trim();
    if (raw === "featured" || raw === "new-arrivals" || raw === "all") {
      return raw;
    }
    return "all";
  }, [collectionParam]);

  const allProducts = useAppSelector(selectAllProducts);

  // Determine base products from the active collection scope
  const baseCollectionProducts = useMemo(() => {
    switch (activeCollection) {
      case "featured":
        return allProducts.filter((p) => p.isFeatured);
      case "new-arrivals":
        return allProducts.filter((p) => p.isNewArrival);
      case "all":
      default:
        return allProducts;
    }
  }, [activeCollection, allProducts]);

  // Determine initial category from route parameters
  const initialCategoryId = useMemo(() => {
    if (categoryIdParam) {
      return categoryIdParam;
    }
    if (categoryParam) {
      const match = CATEGORIES.find(
        (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) return match.id;
    }
    return "all";
  }, [categoryIdParam, categoryParam]);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const selectedCategoryId = userSelectedId ?? initialCategoryId;

  // Filter products by selected category within the active collection scope
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "all") {
      return baseCollectionProducts;
    }

    const selectedCategoryObj = CATEGORIES.find(
      (c) => c.id === selectedCategoryId
    );

    return baseCollectionProducts.filter((product) => {
      if (product.categoryId && product.categoryId === selectedCategoryId) {
        return true;
      }
      if (
        selectedCategoryObj &&
        product.category?.toLowerCase() ===
        selectedCategoryObj.name.toLowerCase()
      ) {
        return true;
      }
      return false;
    });
  }, [baseCollectionProducts, selectedCategoryId]);

  const handleSelectProduct = (product: Product) => {
    router.push({
      pathname: "/products/[id]",
      params: { id: product.id },
    });
  };

  const handleOpenSearch = () => {
    router.push("/search");
  };

  const collectionBadgeText = useMemo(() => {
    if (titleParam) return titleParam;
    if (activeCollection === "featured") return "Featured";
    if (activeCollection === "new-arrivals") return "New Arrivals";
    return null;
  }, [activeCollection, titleParam]);

  return (
    <View className="flex-1 bg-background">
      {/* Native Stack Header Configuration */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleAlign: "left",
          headerTitle: () => (
            <View className="flex-row items-center gap-2">
              {router.canGoBack() && (
                <Pressable
                  onPress={() => router.back()}
                  hitSlop={8}
                  className="w-9 h-9 rounded-full bg-card border border-border items-center justify-center mr-1 active:opacity-75"
                  accessibilityLabel="Go back"
                >
                  <ArrowLeft
                    size={18}
                    color={colors.foreground.DEFAULT}
                    strokeWidth={2}
                  />
                </Pressable>
              )}
              <Text className="text-2xl font-black text-primary tracking-tight">
                Vibeo
              </Text>
              {collectionBadgeText ? (
                <View className="bg-primary/15 border border-primary/30 px-2 py-0.5 rounded-xs ml-0.5">
                  <Text className="text-[10px] font-black text-primary uppercase tracking-wider">
                    {collectionBadgeText}
                  </Text>
                </View>
              ) : null}
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleOpenSearch}
              hitSlop={8}
              className="w-9 h-9 rounded-full bg-card border border-border items-center justify-center active:opacity-75 mr-1"
              accessibilityLabel="Search products"
              accessibilityRole="button"
            >
              <Search
                size={18}
                color={colors.foreground.DEFAULT}
                strokeWidth={2}
              />
            </Pressable>
          ),
        }}
      />

      {/* Horizontal Auto-Scrolling Category Navigation */}
      <ProductCategoryTabs
        categories={CATEGORIES}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setUserSelectedId}
      />

      {/* Two-Column Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-6">
            <View className="w-16 h-16 rounded-full bg-surface border border-border items-center justify-center mb-4">
              <PackageOpen
                size={30}
                color={colors.muted.foreground}
                strokeWidth={1.75}
              />
            </View>
            <Text className="text-base font-bold text-foreground text-center">
              No products found
            </Text>
            <Text className="text-xs text-muted-foreground text-center mt-1.5 max-w-[260px] leading-4">
              {activeCollection !== "all"
                ? `No ${collectionBadgeText || "collection"} products in this category.`
                : "There are currently no products available in this category."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="w-[48.2%] mb-3.5">
            <ProductCard product={item} onPress={handleSelectProduct} />
          </View>
        )}
      />
    </View>
  );
}
