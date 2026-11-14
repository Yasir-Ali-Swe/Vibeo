import { View, FlatList } from "react-native";
import { router } from "expo-router";

import SectionHeader from "@/components/ui/SectionHeader";
import FeaturedProductCard from "@/components/products/FeaturedProductCard";
import { useAppSelector, selectFeaturedProducts } from "@/store";
import type { Product } from "@/types/product";

interface FeaturedProductsProps {
  products?: Product[];
  onViewAll?: () => void;
}

export default function FeaturedProducts({
  products,
  onViewAll,
}: FeaturedProductsProps) {
  const storeProducts = useAppSelector(selectFeaturedProducts);
  const resolvedProducts = products ?? storeProducts;
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push({
        pathname: "/products",
        params: { collection: "featured" },
      });
    }
  };

  return (
    <View className="mb-6">
      {/* Section Header */}
      <SectionHeader
        title="Featured Products"
        subtitle="Handpicked products worth exploring."
        viewAllText="View All"
        onViewAll={handleViewAll}
      />

      {/* Horizontal Carousel */}
      <FlatList
        data={resolvedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeaturedProductCard product={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 2,
        }}
        decelerationRate="fast"
      />
    </View>
  );
}
