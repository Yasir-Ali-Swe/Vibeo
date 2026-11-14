import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Plus, X, Trash2, ImagePlus } from "lucide-react-native";

import type { Product, ProductVariant } from "@/types/product";
import { CATEGORIES } from "@/constants/categories";
import { useTheme, radius } from "@/theme";
import { withAlpha } from "@/utils/color";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import FormField from "@/components/ui/FormField";
import CollectionSwapSheet from "./CollectionSwapSheet";

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  images: string[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isNewArrival: boolean;
}

export interface ProductFormProps {
  initialProduct?: Product;
  featuredProducts: Product[];
  newArrivalProducts: Product[];
  allProducts: Product[];
  onSave: (payload: {
    product: ProductFormData;
    replaceFeaturedId?: string;
    replaceNewArrivalId?: string;
  }) => void;
  onDelete?: (replacements?: {
    featuredReplacementId?: string;
    newArrivalReplacementId?: string;
  }) => void;
}

export default function ProductForm({
  initialProduct,
  featuredProducts,
  newArrivalProducts,
  allProducts,
  onSave,
  onDelete,
}: ProductFormProps) {
  const { colors, isDark } = useTheme();
  const keyboardHeight = useKeyboardHeight();

  // Basic fields
  const [name, setName] = useState(initialProduct?.name || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [category, setCategory] = useState(initialProduct?.category || CATEGORIES[0].name);
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || CATEGORIES[0].id);

  // Pricing
  const [priceStr, setPriceStr] = useState(
    initialProduct?.price !== undefined ? String(initialProduct.price) : ""
  );
  const [originalPriceStr, setOriginalPriceStr] = useState(
    initialProduct?.originalPrice ? String(initialProduct.originalPrice) : ""
  );

  // Inventory
  const [stockStr, setStockStr] = useState(
    initialProduct?.stock !== undefined ? String(initialProduct.stock) : "10"
  );

  // Images
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : initialProduct?.image
        ? [initialProduct.image]
        : []
  );
  const [manualImageUrl, setManualImageUrl] = useState("");

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants ? JSON.parse(JSON.stringify(initialProduct.variants)) : []
  );
  const [newVariantGroupName, setNewVariantGroupName] = useState("");
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [newOptionName, setNewOptionName] = useState("");

  // Collections & atomic swap IDs
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProduct?.isFeatured));
  const [isNewArrival, setIsNewArrival] = useState(Boolean(initialProduct?.isNewArrival));
  const [replaceFeaturedId, setReplaceFeaturedId] = useState<string | undefined>();
  const [replaceNewArrivalId, setReplaceNewArrivalId] = useState<string | undefined>();

  // Swap modal state
  const [swapModal, setSwapModal] = useState<{
    visible: boolean;
    collection: "Featured" | "New arrival";
    mode: "replace_one" | "choose_replacement";
  }>({
    visible: false,
    collection: "Featured",
    mode: "replace_one",
  });

  // Delete swap state (if editing and deleting a member of a collection)
  const [deletePendingReplacements, setDeletePendingReplacements] = useState<{
    featuredReplacementId?: string;
    newArrivalReplacementId?: string;
  }>({});

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Live discount calculation
  const liveDiscountPercent = useMemo(() => {
    const p = parseFloat(priceStr);
    const op = parseFloat(originalPriceStr);
    if (!isNaN(p) && !isNaN(op) && op > p && p > 0) {
      return Math.round(((op - p) / op) * 100);
    }
    return null;
  }, [priceStr, originalPriceStr]);

  // Image picking
  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets[0]?.uri) {
        setImages((prev) => [...prev, res.assets[0].uri]);
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    } catch {
      Alert.alert("Image Picker", "Unable to open image library.");
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualImageUrl.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setManualImageUrl("");
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Variant management
  const handleAddVariantGroup = () => {
    const trimmed = newVariantGroupName.trim();
    if (!trimmed) return;
    const newGroup: ProductVariant = {
      id: `v-${Date.now().toString(36)}`,
      name: trimmed,
      options: [],
    };
    setVariants((prev) => [...prev, newGroup]);
    setNewVariantGroupName("");
  };

  const handleRemoveVariantGroup = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOptionToGroup = (groupIndex: number) => {
    const trimmed = newOptionName.trim();
    if (!trimmed) return;
    setVariants((prev) => {
      const copy = [...prev];
      if (!copy[groupIndex].options.includes(trimmed)) {
        copy[groupIndex].options.push(trimmed);
      }
      return copy;
    });
    setNewOptionName("");
    setActiveGroupIndex(null);
  };

  const handleRemoveOptionFromGroup = (groupIndex: number, option: string) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[groupIndex].options = copy[groupIndex].options.filter((o) => o !== option);
      return copy;
    });
  };

  // Collection switch toggles
  const handleToggleFeatured = (value: boolean) => {
    if (value) {
      // Turning ON: must pick which of the 6 current featured to replace
      setSwapModal({
        visible: true,
        collection: "Featured",
        mode: "replace_one",
      });
    } else {
      // Turning OFF: must pick which candidate product to replace it with
      setSwapModal({
        visible: true,
        collection: "Featured",
        mode: "choose_replacement",
      });
    }
  };

  const handleToggleNewArrival = (value: boolean) => {
    if (value) {
      setSwapModal({
        visible: true,
        collection: "New arrival",
        mode: "replace_one",
      });
    } else {
      setSwapModal({
        visible: true,
        collection: "New arrival",
        mode: "choose_replacement",
      });
    }
  };

  const handleConfirmCollectionSwap = (selectedProductId: string) => {
    if (swapModal.collection === "Featured") {
      setReplaceFeaturedId(selectedProductId);
      setIsFeatured(swapModal.mode === "replace_one");
    } else {
      setReplaceNewArrivalId(selectedProductId);
      setIsNewArrival(swapModal.mode === "replace_one");
    }
    setSwapModal((prev) => ({ ...prev, visible: false }));
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (originalPriceStr.trim()) {
      const op = parseFloat(originalPriceStr);
      if (isNaN(op) || op <= price) {
        newErrors.originalPrice = "Original price must be greater than current price.";
      }
    }

    const stock = parseInt(stockStr, 10);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = "Stock must be a whole number of 0 or more.";
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const price = Math.round(parseFloat(priceStr));
    const originalPrice = originalPriceStr.trim()
      ? Math.round(parseFloat(originalPriceStr))
      : undefined;
    const stock = Math.max(0, parseInt(stockStr, 10));

    // Filter out variant groups with empty options
    const validVariants = variants.filter((v) => v.options.length > 0);

    onSave({
      product: {
        name: name.trim(),
        description: description.trim(),
        category,
        categoryId,
        price,
        originalPrice,
        stock,
        image: images[0],
        images,
        variants: validVariants,
        isFeatured,
        isNewArrival,
      },
      replaceFeaturedId,
      replaceNewArrivalId,
    });
  };

  // Deletion flow
  const handleDeletePress = () => {
    if (!onDelete || !initialProduct) return;

    if (allProducts.length <= 6) {
      Alert.alert(
        "Cannot Delete Product",
        "The catalog cannot drop below 6 products because both Featured and New Arrivals require exactly 6 slots."
      );
      return;
    }

    // If product is featured and/or new arrival, require replacement selection
    if (initialProduct.isFeatured && !deletePendingReplacements.featuredReplacementId) {
      setSwapModal({
        visible: true,
        collection: "Featured",
        mode: "choose_replacement",
      });
      return;
    }

    if (initialProduct.isNewArrival && !deletePendingReplacements.newArrivalReplacementId) {
      setSwapModal({
        visible: true,
        collection: "New arrival",
        mode: "choose_replacement",
      });
      return;
    }

    Alert.alert(
      "Delete Product",
      `Are you sure you want to permanently delete "${initialProduct.name}"? This will also remove it from saved carts and wishlists.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(deletePendingReplacements),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: keyboardHeight + 110,
        }}
      >
        {/* Section 1: Basic Information */}
        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Basic Information
        </Text>

        <FormField
          label="Product Name *"
          placeholder="e.g. AeroGlide Low-Top Sneakers"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <View style={{ marginTop: 14 }}>
          <FormField
            label="Description"
            placeholder="Detailed description of features, materials, and fit..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ minHeight: 90 }}
          />
        </View>

        {/* Category selector */}
        <View style={{ marginTop: 14 }}>
          <Text
            style={{
              color: colors.foreground.muted,
              fontSize: 13,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 2 }}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    setCategory(cat.name);
                    setCategoryId(cat.id);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  style={{
                    paddingHorizontal: 14,
                    height: 36,
                    borderRadius: radius.full,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? colors.primary.DEFAULT
                      : colors.border.strong,
                    backgroundColor: isSelected
                      ? colors.primary.DEFAULT
                      : colors.surface.DEFAULT,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected
                        ? colors.primary.foreground
                        : colors.foreground.DEFAULT,
                      fontSize: 12,
                      fontWeight: isSelected ? "700" : "500",
                    }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Section 2: Pricing */}
        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 20 }} />

        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Pricing
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormField
              label="Price (Rs.) *"
              placeholder="e.g. 4500"
              keyboardType="numeric"
              value={priceStr}
              onChangeText={setPriceStr}
              error={errors.price}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <FormField
              label="Original Price (Rs.)"
              placeholder="e.g. 6000"
              keyboardType="numeric"
              value={originalPriceStr}
              onChangeText={setOriginalPriceStr}
              error={errors.originalPrice}
            />
          </View>
        </View>

        {liveDiscountPercent !== null && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              padding: 10,
              borderRadius: radius.md,
              backgroundColor: withAlpha(colors.success.DEFAULT, 0.12),
            }}
          >
            <Text
              style={{
                color: colors.success.DEFAULT,
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              Calculated Discount: {liveDiscountPercent}% OFF
            </Text>
          </View>
        )}

        {/* Section 3: Inventory */}
        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 20 }} />

        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Inventory
        </Text>

        <FormField
          label="Available Stock *"
          placeholder="e.g. 24"
          keyboardType="number-pad"
          value={stockStr}
          onChangeText={setStockStr}
          error={errors.stock}
        />

        {/* Section 4: Product Images */}
        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 20 }} />

        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 4,
          }}
        >
          Images
        </Text>
        <Text
          style={{
            color: colors.muted.foreground,
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          Add image URLs or pick from your device gallery. The first image serves as the thumbnail.
        </Text>

        {errors.images ? (
          <Text
            style={{
              color: colors.destructive.DEFAULT,
              fontSize: 12,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            {errors.images}
          </Text>
        ) : null}

        {/* Gallery thumbnails */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 14 }}
          >
            {images.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={{
                  position: "relative",
                  width: 76,
                  height: 76,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: index === 0 ? colors.primary.DEFAULT : colors.border.DEFAULT,
                  overflow: "hidden",
                  marginRight: 10,
                  backgroundColor: colors.surface.DEFAULT,
                }}
              >
                <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                {index === 0 && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: colors.primary.DEFAULT,
                      paddingVertical: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.primary.foreground,
                        fontSize: 9,
                        fontWeight: "700",
                      }}
                    >
                      MAIN
                    </Text>
                  </View>
                )}
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove image ${index + 1}`}
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    width: 20,
                    height: 20,
                    borderRadius: radius.full,
                    backgroundColor: "rgba(0,0,0,0.65)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={12} color="#FFFFFF" strokeWidth={2.5} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Pressable
            onPress={handlePickImage}
            accessibilityRole="button"
            accessibilityLabel="Pick image from gallery"
            style={{
              flex: 1,
              height: 42,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.strong,
              backgroundColor: colors.surface.DEFAULT,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImagePlus size={16} color={colors.foreground.DEFAULT} strokeWidth={2} />
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 13,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Pick from gallery
            </Text>
          </Pressable>
        </View>

        {/* Manual URL input */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={manualImageUrl}
            onChangeText={setManualImageUrl}
            placeholder="Or paste image URL..."
            placeholderTextColor={colors.muted.subtle}
            selectionColor={colors.primary.DEFAULT}
            keyboardAppearance={isDark ? "dark" : "light"}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              flex: 1,
              height: 42,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.strong,
              backgroundColor: colors.surface.DEFAULT,
              paddingHorizontal: 12,
              fontSize: 13,
              color: colors.foreground.DEFAULT,
              marginRight: 8,
            }}
          />
          <Pressable
            onPress={handleAddManualUrl}
            accessibilityRole="button"
            accessibilityLabel="Add image URL"
            style={{
              height: 42,
              paddingHorizontal: 14,
              borderRadius: radius.md,
              backgroundColor: colors.surface.elevated,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Add URL
            </Text>
          </Pressable>
        </View>

        {/* Section 5: Variants */}
        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 20 }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: colors.foreground.DEFAULT,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Variants (e.g. Size, Color)
          </Text>
        </View>

        {/* Existing variant groups */}
        {variants.map((vGroup, gIdx) => (
          <View
            key={vGroup.id || `vg-${gIdx}`}
            style={{
              padding: 12,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              backgroundColor: colors.card.DEFAULT,
              marginBottom: 12,
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
              <Text
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {vGroup.name}
              </Text>

              <Pressable
                onPress={() => handleRemoveVariantGroup(gIdx)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Remove variant group ${vGroup.name}`}
              >
                <Trash2 size={16} color={colors.destructive.DEFAULT} />
              </Pressable>
            </View>

            {/* Chips */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
              {vGroup.options.map((opt) => (
                <View
                  key={opt}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    height: 28,
                    borderRadius: radius.full,
                    backgroundColor: colors.surface.elevated,
                    marginRight: 6,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: colors.foreground.DEFAULT,
                      fontSize: 12,
                      fontWeight: "600",
                      marginRight: 6,
                    }}
                  >
                    {opt}
                  </Text>
                  <Pressable
                    onPress={() => handleRemoveOptionFromGroup(gIdx, opt)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove option ${opt}`}
                  >
                    <X size={12} color={colors.muted.foreground} />
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Add option to this group */}
            {activeGroupIndex === gIdx ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <TextInput
                  value={newOptionName}
                  onChangeText={setNewOptionName}
                  placeholder={`Add option (e.g. "XL", "Navy")...`}
                  placeholderTextColor={colors.muted.subtle}
                  selectionColor={colors.primary.DEFAULT}
                  keyboardAppearance={isDark ? "dark" : "light"}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.border.strong,
                    backgroundColor: colors.surface.DEFAULT,
                    paddingHorizontal: 10,
                    fontSize: 12,
                    color: colors.foreground.DEFAULT,
                    marginRight: 8,
                  }}
                />
                <Pressable
                  onPress={() => handleAddOptionToGroup(gIdx)}
                  style={{
                    height: 36,
                    paddingHorizontal: 12,
                    borderRadius: radius.md,
                    backgroundColor: colors.primary.DEFAULT,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 6,
                  }}
                >
                  <Text style={{ color: colors.primary.foreground, fontSize: 12, fontWeight: "700" }}>
                    Add
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveGroupIndex(null)}
                  style={{
                    height: 36,
                    paddingHorizontal: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: colors.muted.foreground, fontSize: 12 }}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setActiveGroupIndex(gIdx);
                  setNewOptionName("");
                }}
                accessibilityRole="button"
                accessibilityLabel={`Add option to ${vGroup.name}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Plus size={14} color={colors.primary.DEFAULT} />
                <Text
                  style={{
                    color: colors.primary.DEFAULT,
                    fontSize: 12,
                    fontWeight: "600",
                    marginLeft: 4,
                  }}
                >
                  Add Option
                </Text>
              </Pressable>
            )}
          </View>
        ))}

        {/* Add new group row */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={newVariantGroupName}
            onChangeText={setNewVariantGroupName}
            placeholder='Add group (e.g. "Size", "Color")...'
            placeholderTextColor={colors.muted.subtle}
            selectionColor={colors.primary.DEFAULT}
            keyboardAppearance={isDark ? "dark" : "light"}
            style={{
              flex: 1,
              height: 42,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.strong,
              backgroundColor: colors.surface.DEFAULT,
              paddingHorizontal: 12,
              fontSize: 13,
              color: colors.foreground.DEFAULT,
              marginRight: 8,
            }}
          />
          <Pressable
            onPress={handleAddVariantGroup}
            accessibilityRole="button"
            accessibilityLabel="Add variant group"
            style={{
              height: 42,
              paddingHorizontal: 14,
              borderRadius: radius.md,
              backgroundColor: colors.surface.elevated,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Add Group
            </Text>
          </Pressable>
        </View>

        {/* Section 6: Collections (6 & 6 Invariant) */}
        <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginVertical: 20 }} />

        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 4,
          }}
        >
          Homepage Collections
        </Text>
        <Text
          style={{
            color: colors.muted.foreground,
            fontSize: 12,
            marginBottom: 14,
          }}
        >
          Featured and New Arrivals each strictly require exactly 6 products. Toggling a collection switch will prompt you to select an atomic slot swap.
        </Text>

        {/* Featured switch */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.DEFAULT,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "600" }}>
              Featured Product
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 2 }}>
              Shown in the homepage horizontal carousel
            </Text>
          </View>
          <Switch
            value={isFeatured}
            onValueChange={handleToggleFeatured}
            thumbColor={isFeatured ? colors.primary.DEFAULT : colors.muted.subtle}
            trackColor={{
              false: colors.surface.elevated,
              true: withAlpha(colors.primary.DEFAULT, 0.4),
            }}
          />
        </View>

        {/* New Arrival switch */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: colors.foreground.DEFAULT, fontSize: 14, fontWeight: "600" }}>
              New Arrival
            </Text>
            <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 2 }}>
              Shown in the homepage 2-column grid
            </Text>
          </View>
          <Switch
            value={isNewArrival}
            onValueChange={handleToggleNewArrival}
            thumbColor={isNewArrival ? colors.primary.DEFAULT : colors.muted.subtle}
            trackColor={{
              false: colors.surface.elevated,
              true: withAlpha(colors.primary.DEFAULT, 0.4),
            }}
          />
        </View>

        {/* Delete Product (Edit mode only) */}
        {initialProduct && onDelete && (
          <View style={{ marginTop: 36, marginBottom: 12 }}>
            <View style={{ height: 1, backgroundColor: colors.border.DEFAULT, marginBottom: 20 }} />
            <Pressable
              onPress={handleDeletePress}
              accessibilityRole="button"
              accessibilityLabel="Delete product"
              style={({ pressed }) => ({
                height: 46,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.destructive.DEFAULT,
                backgroundColor: pressed ? withAlpha(colors.destructive.DEFAULT, 0.12) : "transparent",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Trash2 size={16} color={colors.destructive.DEFAULT} strokeWidth={2} />
              <Text
                style={{
                  color: colors.destructive.DEFAULT,
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 8,
                }}
              >
                Delete Product
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Save Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(keyboardHeight, 14),
          borderTopWidth: 1,
          borderTopColor: colors.border.DEFAULT,
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save product"
          style={({ pressed }) => ({
            height: 48,
            borderRadius: radius.md,
            backgroundColor: pressed ? colors.primary.dark : colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Text
            style={{
              color: colors.primary.foreground,
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {initialProduct ? "Save Changes" : "Create Product"}
          </Text>
        </Pressable>
      </View>

      {/* Collection Swap Modal */}
      {swapModal.visible && (
        <CollectionSwapSheet
          visible={true}
          onClose={() => setSwapModal((prev) => ({ ...prev, visible: false }))}
          collectionName={swapModal.collection}
          mode={swapModal.mode}
          currentMembers={
            swapModal.collection === "Featured" ? featuredProducts : newArrivalProducts
          }
          candidateProducts={allProducts.filter((p) =>
            swapModal.collection === "Featured"
              ? !featuredProducts.some((f) => f.id === p.id) && p.id !== initialProduct?.id
              : !newArrivalProducts.some((n) => n.id === p.id) && p.id !== initialProduct?.id
          )}
          onConfirm={(selectedId) => {
            if (swapModal.mode === "choose_replacement" && initialProduct && !onSave) {
              setDeletePendingReplacements((prev) => ({
                ...prev,
                [swapModal.collection === "Featured"
                  ? "featuredReplacementId"
                  : "newArrivalReplacementId"]: selectedId,
              }));
            } else {
              handleConfirmCollectionSwap(selectedId);
            }
          }}
        />
      )}
    </View>
  );
}

