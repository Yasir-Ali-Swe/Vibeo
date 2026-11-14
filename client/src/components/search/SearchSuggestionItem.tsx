import { View, Text, Image, Pressable } from "react-native";
import { ChevronRight, Image as ImageIcon } from "lucide-react-native";
import { useState, memo } from "react";
import type { ProductSearchSuggestion } from "@/types/product";
import { formatPrice } from "@/utils/format";
import { useTheme } from "@/theme";

interface SearchSuggestionItemProps {
  item: ProductSearchSuggestion;
  onPress: (item: ProductSearchSuggestion) => void;
}

function SearchSuggestionItem({
  item,
  onPress,
}: SearchSuggestionItemProps) {
  const { colors } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center px-4 py-3 bg-background border-b border-border/60 active:bg-surface"
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name}`}
    >
      {/* Product Thumbnail */}
      <View className="w-14 h-14 rounded-sm bg-surface border border-border overflow-hidden items-center justify-center mr-3">
        {item.image && !imageFailed ? (
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImageIcon size={20} color={colors.muted.subtle} />
        )}
      </View>

      {/* Info column */}
      <View className="flex-1 justify-center mr-2">
        <Text
          numberOfLines={1}
          className="text-sm font-semibold text-foreground tracking-tight"
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-medium"
        >
          {item.category}
        </Text>
      </View>

      {/* Price & Chevron */}
      <View className="flex-row items-center gap-1.5">
        <Text className="text-sm font-bold text-primary">
          {formatPrice(item.price)}
        </Text>
        <ChevronRight size={16} color={colors.muted.subtle} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

export default memo(SearchSuggestionItem);

