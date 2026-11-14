import { ScrollView, Pressable, Text, View } from "react-native";
import { useTheme, radius } from "@/theme";
import { withAlpha } from "@/utils/color";

export interface FilterItem<T extends string> {
  key: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  filters: readonly FilterItem<T>[] | FilterItem<T>[];
  value: T;
  onChange: (key: T) => void;
  counts: Record<T, number>;
}

export default function FilterChips<T extends string>({
  filters,
  value,
  onChange,
  counts,
}: FilterChipsProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
    >
      {filters.map((filter) => {
        const selected = filter.key === value;
        return (
          <Pressable
            key={filter.key}
            onPress={() => onChange(filter.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${filter.label}, ${counts[filter.key]} items`}
            style={{
              height: 36,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              marginRight: 8,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: selected ? colors.primary.DEFAULT : colors.border.strong,
              backgroundColor: selected ? colors.primary.DEFAULT : colors.surface.DEFAULT,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: selected ? colors.primary.foreground : colors.foreground.muted,
              }}
            >
              {filter.label}
            </Text>
            <View
              style={{
                minWidth: 18,
                height: 18,
                marginLeft: 8,
                paddingHorizontal: 5,
                borderRadius: radius.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: selected
                  ? withAlpha(colors.primary.foreground, 0.25)
                  : colors.surface.elevated,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: selected ? colors.primary.foreground : colors.muted.foreground,
                }}
              >
                {counts[filter.key]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

