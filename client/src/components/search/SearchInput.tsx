import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { ArrowLeft, Search, X } from "lucide-react-native";
import { useTheme } from "@/theme";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onBack: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChangeText,
  onClear,
  onBack,
  isLoading = false,
  placeholder = "Search products, brands, or categories...",
}: SearchInputProps) {
  const { colors, isDark } = useTheme();
  return (
    <View className="flex-row items-center gap-2.5 px-4 py-2 bg-background border-b border-border">
      {/* Back button */}
      <Pressable
        onPress={onBack}
        hitSlop={8}
        className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center active:opacity-75"
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <ArrowLeft size={20} color={colors.foreground.DEFAULT} strokeWidth={2} />
      </Pressable>

      {/* Input container */}
      <View className="flex-1 flex-row items-center bg-card border border-border rounded-md px-3 py-2">
        <Search size={18} color={colors.muted.foreground} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted.subtle}
          selectionColor={colors.primary.DEFAULT}
          keyboardAppearance={isDark ? "dark" : "light"}
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          className="flex-1 ml-2 text-sm text-foreground py-0"
        />

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} className="ml-1" />
        ) : value.length > 0 ? (
          <Pressable
            onPress={onClear}
            hitSlop={8}
            className="w-6 h-6 rounded-full bg-surface-elevated items-center justify-center active:opacity-70 ml-1"
            accessibilityLabel="Clear search input"
            accessibilityRole="button"
          >
            <X size={14} color={colors.muted.foreground} strokeWidth={2.5} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

