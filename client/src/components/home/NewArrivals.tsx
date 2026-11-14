import { View } from "react-native";
import { router } from "expo-router";

import SectionHeader from "@/components/ui/SectionHeader";
import ProductActionCard from "@/components/products/ProductActionCard";
import { useAppSelector, selectNewArrivalProducts } from "@/store";
import type { Product } from "@/types/product";

interface NewArrivalsProps {
  products?: Product[];
  onViewAll?: () => void;
}

export default function NewArrivals({
  products,
  onViewAll,
}: NewArrivalsProps) {
  const storeProducts = useAppSelector(selectNewArrivalProducts);
  const resolvedProducts = products ?? storeProducts;
  // Exactly 6 products = 3 rows in 2-column grid
  const displayProducts = resolvedProducts.slice(0, 6);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push({
        pathname: "/products",
        params: { collection: "new-arrivals" },
      });
    }
  };

  return (
    <View className="mb-6">
      {/* Section Header */}
      <SectionHeader
        title="New Arrivals"
        subtitle="Discover the latest products added to Trove."
        viewAllText="View All"
        onViewAll={handleViewAll}
      />

      {/* Two-Column Grid: Exactly 3 rows initially */}
      <View className="flex-row flex-wrap justify-between px-4">
        {displayProducts.map((product) => (
          <View
            key={product.id}
            className="w-[48.2%] mb-3.5"
          >
            <ProductActionCard product={product} />
          </View>
        ))}
      </View>
    </View>
  );
}
