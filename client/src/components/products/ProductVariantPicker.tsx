import { View, Text, Pressable } from "react-native";
import type { ProductVariant, SelectedVariants } from "@/types/product";
import { useTheme } from "@/theme";

interface ProductVariantPickerProps {
  variants?: ProductVariant[];
  selectedVariants: SelectedVariants;
  onSelectOption: (variantName: string, option: string) => void;
  unselectedErrors?: string[];
}

const GROUP_SPACING = 18; // space between Size, Color, etc.
const LABEL_SPACING = 8; // space between the label and its options
const CHIP_SPACING = 10; // space between option chips (horizontal and vertical)

export default function ProductVariantPicker({
  variants,
  selectedVariants,
  onSelectOption,
  unselectedErrors = [],
}: ProductVariantPickerProps) {
  const { colors } = useTheme();
  if (!variants || variants.length === 0) return null;

  return (
    <View>
      {variants.map((variant, index) => {
        const selected = selectedVariants[variant.name];
        const hasError = unselectedErrors.includes(variant.name);

        return (
          <View
            key={variant.id || variant.name}
            style={{ marginTop: index === 0 ? 0 : GROUP_SPACING }}
          >
            {/* Label */}
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{ marginRight: 8 }}
                className="text-sm font-semibold text-foreground"
              >
                {variant.name}
              </Text>
              {selected ? (
                <Text className="text-sm text-muted-foreground">{selected}</Text>
              ) : null}
            </View>

            {/* Options: the negative bottom margin cancels the last row's chip margin */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: LABEL_SPACING,
                marginBottom: -CHIP_SPACING,
              }}
            >
              {variant.options.map((option) => {
                const isSelected = selected === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => onSelectOption(variant.name, option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${variant.name} ${option}`}
                    style={{
                      marginRight: CHIP_SPACING,
                      marginBottom: CHIP_SPACING,
                      minWidth: 48,
                      height: 44,
                      paddingHorizontal: 16,
                    }}
                    className={`items-center justify-center rounded-md border ${isSelected
                      ? "border-primary bg-primary"
                      : hasError
                        ? "border-destructive/60 bg-card"
                        : "border-border bg-card active:bg-surface-elevated"
                      }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${isSelected ? "text-primary-foreground" : "text-foreground"
                        }`}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {hasError && (
              <Text
                style={{
                  marginTop: CHIP_SPACING + 4,
                  color: colors.destructive.DEFAULT,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Please select a {variant.name.toLowerCase()}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}