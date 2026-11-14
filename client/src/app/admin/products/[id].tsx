import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { PackageX } from "lucide-react-native";
import {
  useAppDispatch,
  useAppSelector,
  selectProductById,
  selectFeaturedProducts,
  selectNewArrivalProducts,
  selectAllProducts,
  updateProduct,
  deleteProduct,
} from "@/store";
import ProductForm, { type ProductFormData } from "@/components/admin/ProductForm";
import { useTheme, radius } from "@/theme";

export default function EditProductScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<"/admin/products/[id]">();
  const productId = Array.isArray(id) ? id[0] : id ?? "";

  const product = useAppSelector(selectProductById(productId));
  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const newArrivalProducts = useAppSelector(selectNewArrivalProducts);
  const allProducts = useAppSelector(selectAllProducts);

  if (!product) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border.DEFAULT,
            backgroundColor: colors.surface.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <PackageX size={28} color={colors.muted.subtle} strokeWidth={1.75} />
        </View>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground.DEFAULT }}>
          Product not found
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.muted.foreground,
            textAlign: "center",
            marginTop: 6,
            marginBottom: 20,
            maxWidth: 240,
          }}
        >
          This product may have been removed or does not exist.
        </Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to products list"
          style={{
            height: 42,
            paddingHorizontal: 20,
            borderRadius: radius.md,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.primary.foreground, fontSize: 13, fontWeight: "700" }}>
            Return to products
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = ({
    product: formData,
    replaceFeaturedId,
    replaceNewArrivalId,
  }: {
    product: ProductFormData;
    replaceFeaturedId?: string;
    replaceNewArrivalId?: string;
  }) => {
    dispatch(
      updateProduct({
        id: product.id,
        ...formData,
        replaceFeaturedId,
        replaceNewArrivalId,
      })
    );
    router.back();
  };

  const handleDelete = (replacements?: {
    featuredReplacementId?: string;
    newArrivalReplacementId?: string;
  }) => {
    dispatch(deleteProduct({ id: product.id, replacements }));
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProductForm
        initialProduct={product}
        featuredProducts={featuredProducts}
        newArrivalProducts={newArrivalProducts}
        allProducts={allProducts}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </View>
  );
}

