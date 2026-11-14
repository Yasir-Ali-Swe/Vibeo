import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Sparkles } from "lucide-react-native";

import { useTheme, radius } from "@/theme";
import {
  useAppDispatch,
  useAppSelector,
  selectAllProducts,
  selectFeaturedProducts,
  selectNewArrivalProducts,
  swapFeatured,
  swapNewArrival,
} from "@/store";
import CollectionSlots from "@/components/admin/CollectionSlots";

type CollectionTab = "featured" | "new_arrival";

export default function HomepageCollectionsScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<CollectionTab>("featured");

  const allProducts = useAppSelector(selectAllProducts);
  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const newArrivalProducts = useAppSelector(selectNewArrivalProducts);

  const handleReplaceSlot = (removeId: string, addId: string) => {
    if (activeTab === "featured") {
      dispatch(swapFeatured({ removeId, addId }));
    } else {
      dispatch(swapNewArrival({ removeId, addId }));
    }
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
      {/* Intro info box */}
      <View
        style={{
          padding: 14,
          borderRadius: radius.md,
          backgroundColor: colors.surface.DEFAULT,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <Sparkles size={16} color={colors.primary.DEFAULT} style={{ marginRight: 6 }} />
          <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "700" }}>
            Collection Slot Rules
          </Text>
        </View>
        <Text style={{ color: colors.muted.foreground, fontSize: 12, lineHeight: 18 }}>
          Each collection strictly holds exactly 6 products at all times. To change which products appear on the homepage, use the Replace button on any slot to swap in an eligible product from your catalog.
        </Text>
      </View>

      {/* Two-option Segmented Switcher */}
      <View
        style={{
          flexDirection: "row",
          padding: 4,
          borderRadius: radius.md,
          backgroundColor: colors.surface.elevated,
          marginBottom: 16,
        }}
      >
        <Pressable
          onPress={() => setActiveTab("featured")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "featured" }}
          accessibilityLabel="Featured collection slots"
          style={{
            flex: 1,
            height: 38,
            borderRadius: radius.sm,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              activeTab === "featured" ? colors.primary.DEFAULT : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color:
                activeTab === "featured"
                  ? colors.primary.foreground
                  : colors.muted.foreground,
            }}
          >
            Featured (6)
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("new_arrival")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "new_arrival" }}
          accessibilityLabel="New arrivals collection slots"
          style={{
            flex: 1,
            height: 38,
            borderRadius: radius.sm,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              activeTab === "new_arrival" ? colors.primary.DEFAULT : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color:
                activeTab === "new_arrival"
                  ? colors.primary.foreground
                  : colors.muted.foreground,
            }}
          >
            New Arrivals (6)
          </Text>
        </Pressable>
      </View>

      {/* Slots */}
      {activeTab === "featured" ? (
        <CollectionSlots
          collectionName="Featured"
          products={featuredProducts}
          allProducts={allProducts}
          onReplace={handleReplaceSlot}
        />
      ) : (
        <CollectionSlots
          collectionName="New arrival"
          products={newArrivalProducts}
          allProducts={allProducts}
          onReplace={handleReplaceSlot}
        />
      )}
    </ScrollView>
  );
}

