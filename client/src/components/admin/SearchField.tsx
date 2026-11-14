import { memo } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";
import { useTheme, radius } from "@/theme";

export interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

function SearchField({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchFieldProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        paddingHorizontal: 12,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.card.DEFAULT,
      }}
    >
      <Search size={18} color={colors.muted.foreground} strokeWidth={2} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted.subtle}
        selectionColor={colors.primary.DEFAULT}
        keyboardAppearance={isDark ? "dark" : "light"}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          flex: 1,
          height: "100%",
          marginLeft: 8,
          fontSize: 14,
          color: colors.foreground.DEFAULT,
        }}
      />

      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={{
            width: 28,
            height: 28,
            borderRadius: radius.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surface.elevated,
          }}
        >
          <X size={14} color={colors.muted.foreground} strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default memo(SearchField);

