import { View } from "react-native";
import { router } from "expo-router";
import {
  useAppDispatch,
  useAppSelector,
  addProduct,
  selectFeaturedProducts,
  selectNewArrivalProducts,
  selectAllProducts,
} from "@/store";
import ProductForm, { type ProductFormData } from "@/components/admin/ProductForm";
import { useTheme } from "@/theme";

export default function AddProductScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const newArrivalProducts = useAppSelector(selectNewArrivalProducts);
  const allProducts = useAppSelector(selectAllProducts);

  const handleSave = ({
    product,
    replaceFeaturedId,
    replaceNewArrivalId,
  }: {
    product: ProductFormData;
    replaceFeaturedId?: string;
    replaceNewArrivalId?: string;
  }) => {
    dispatch(
      addProduct({
        product,
        replaceFeaturedId,
        replaceNewArrivalId,
      })
    );
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ProductForm
        featuredProducts={featuredProducts}
        newArrivalProducts={newArrivalProducts}
        allProducts={allProducts}
        onSave={handleSave}
      />
    </View>
  );
}

