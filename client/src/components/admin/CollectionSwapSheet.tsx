import { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { Check, X } from "lucide-react-native";
import type { Product } from "@/types/product";
import { useTheme, radius } from "@/theme";
import { formatPrice } from "@/utils/format";
import SearchField from "./SearchField";

export interface CollectionSwapSheetProps {
  visible: boolean;
  onClose: () => void;
  collectionName: "Featured" | "New arrival";
  mode: "replace_one" | "choose_replacement";
  currentMembers: Product[];
  candidateProducts: Product[];
  onConfirm: (selectedProductId: string) => void;
}

export default function CollectionSwapSheet({
  visible,
  onClose,
  collectionName,
  mode,
  currentMembers,
  candidateProducts,
  onConfirm,
}: CollectionSwapSheetProps) {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const title =
    mode === "replace_one"
      ? `${collectionName} is limited to exactly 6 products`
      : `${collectionName} requires exactly 6 products`;

  const subtitle =
    mode === "replace_one"
      ? `Choose which of the 6 current ${collectionName.toLowerCase()} products to remove:`
      : `Choose an eligible replacement product to add to ${collectionName.toLowerCase()}:`;

  const filteredCandidates = useMemo(() => {
    if (!query.trim()) return candidateProducts;
    const q = query.toLowerCase().trim();
    return candidateProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [candidateProducts, query]);

  const items = mode === "replace_one" ? currentMembers : filteredCandidates;

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm(selectedId);
    setSelectedId(null);
    setQuery("");
    onClose();
  };

  const handleCancel = () => {
    setSelectedId(null);
    setQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            maxHeight: height * 0.8,
            backgroundColor: colors.background,
            borderTopLeftRadius: radius.lg,
            borderTopRightRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingBottom: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  color: colors.muted.foreground,
                  fontSize: 13,
                  marginTop: 3,
                }}
              >
                {subtitle}
              </Text>
            </View>

            <Pressable
              onPress={handleCancel}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surface.DEFAULT,
              }}
            >
              <X size={18} color={colors.foreground.DEFAULT} />
            </Pressable>
          </View>

          {/* Search bar in replacement picker mode */}
          {mode === "choose_replacement" && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
              <SearchField
                value={query}
                onChangeText={setQuery}
                placeholder="Search products to replace with..."
              />
            </View>
          )}

          {/* List */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 6 }}
            style={{ maxHeight: height * 0.45 }}
            renderItem={({ item }) => {
              const isSelected = selectedId === item.id;
              const imageUri =
                item.image || (item.images && item.images.length > 0 ? item.images[0] : "");

              return (
                <Pressable
                  onPress={() => setSelectedId(item.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${item.name}, ${formatPrice(item.price)}`}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? colors.primary.DEFAULT
                      : colors.border.DEFAULT,
                    backgroundColor: isSelected
                      ? colors.surface.elevated
                      : pressed
                        ? colors.surface.DEFAULT
                        : colors.card.DEFAULT,
                    marginBottom: 8,
                  })}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: 44,
                      height: 44,
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
                    <Text
                      style={{
                        color: colors.muted.foreground,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      {formatPrice(item.price)} · {item.category || "General"}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: radius.full,
                      borderWidth: 2,
                      borderColor: isSelected
                        ? colors.primary.DEFAULT
                        : colors.border.strong,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected
                        ? colors.primary.DEFAULT
                        : "transparent",
                    }}
                  >
                    {isSelected && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            }}
          />

          {/* Actions */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 12,
            }}
          >
            <Pressable
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel selection"
              style={{
                flex: 1,
                height: 44,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border.strong,
                backgroundColor: colors.surface.DEFAULT,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              disabled={!selectedId}
              accessibilityRole="button"
              accessibilityLabel="Confirm replacement"
              accessibilityState={{ disabled: !selectedId }}
              style={{
                flex: 1,
                height: 44,
                borderRadius: radius.md,
                backgroundColor: selectedId
                  ? colors.primary.DEFAULT
                  : colors.surface.elevated,
                alignItems: "center",
                justifyContent: "center",
                opacity: selectedId ? 1 : 0.45,
              }}
            >
              <Text
                style={{
                  color: selectedId
                    ? colors.primary.foreground
                    : colors.muted.foreground,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Confirm Swap
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

