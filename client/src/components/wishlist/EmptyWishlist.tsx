import { Pressable, Text, View } from "react-native";
import { Heart, ShoppingBag } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "@/theme";

export default function EmptyWishlist() {
  const { colors } = useTheme();
  return (
    <View className="flex-1 items-center justify-center px-8 py-20 bg-background">
      <View className="mb-6 h-28 w-28 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <Heart size={52} color={colors.primary.DEFAULT} />
      </View>

      <Text className="text-xl font-bold text-foreground">Your wishlist is empty</Text>

      <Text className="mt-3 text-center text-sm leading-6 text-muted-foreground">
        You haven&apos;t added any products to your wishlist yet. Explore our collection and save your favorite items here.
      </Text>

      <Pressable
        onPress={() => router.navigate("/(tabs)")}
        className="mt-7 flex-row items-center gap-2 rounded-md bg-primary px-6 py-3.5 active:bg-primary-dark"
      >
        <ShoppingBag size={18} color={colors.primary.foreground} />
        <Text className="font-bold text-primary-foreground">Start Shopping</Text>
      </Pressable>
    </View>
  );
}
