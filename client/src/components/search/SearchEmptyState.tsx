import { View, Text, Pressable } from "react-native";
import { Search, PackageX, Sparkles } from "lucide-react-native";
import { useTheme } from "@/theme";

interface SearchEmptyStateProps {
  query: string;
  onSuggestionPress?: (keyword: string) => void;
}

const POPULAR_SEARCHES = [
  "Sneakers",
  "Watch",
  "Hoodie",
  "Headphones",
  "Backpack",
  "Sunglasses",
];

export default function SearchEmptyState({
  query,
  onSuggestionPress,
}: SearchEmptyStateProps) {
  const { colors } = useTheme();
  const hasQuery = query.trim().length > 0;

  if (hasQuery) {
    return (
      <View className="flex-1 items-center justify-center px-6 py-20">
        <View className="w-16 h-16 rounded-full bg-surface border border-border items-center justify-center mb-4">
          <PackageX size={30} color={colors.muted.foreground} strokeWidth={1.75} />
        </View>
        <Text className="text-base font-bold text-foreground text-center">
          No results found
        </Text>
        <Text className="text-xs text-muted-foreground text-center mt-1.5 max-w-[260px] leading-4">
          We couldn&apos;t find any products matching &ldquo;{query.trim()}&rdquo;. Try checking the spelling or use broader keywords.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-5 pt-8">
      {/* Intro hint */}
      <View className="flex-row items-center gap-2 mb-4">
        <Search size={16} color={colors.primary.DEFAULT} />
        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Suggested Searches
        </Text>
      </View>

      {/* Pill suggestions */}
      <View className="flex-row flex-wrap gap-2 mb-8">
        {POPULAR_SEARCHES.map((keyword) => (
          <Pressable
            key={keyword}
            onPress={() => onSuggestionPress?.(keyword)}
            className="flex-row items-center gap-1.5 bg-card border border-border rounded-full px-3.5 py-2 active:bg-surface-elevated"
            accessibilityRole="button"
          >
            <Sparkles size={12} color={colors.primary.DEFAULT} />
            <Text className="text-xs font-medium text-foreground">
              {keyword}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Quick shopping tip */}
      <View className="bg-card/60 border border-border/80 rounded-lg p-4">
        <Text className="text-xs font-semibold text-foreground mb-1">
          Instant Discovery
        </Text>
        <Text className="text-[11px] text-muted-foreground leading-4">
          Search by product name, category, or tags to find your next favorite item instantly.
        </Text>
      </View>
    </View>
  );
}
