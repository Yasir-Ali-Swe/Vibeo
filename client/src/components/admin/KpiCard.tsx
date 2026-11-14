import { memo } from "react";
import { View, Text, Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme, radius } from "@/theme";
import { withAlpha } from "@/utils/color";

export interface KpiCardProps {
  label: string;
  value: string;
  subline?: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
  onPress?: () => void;
}

function KpiCard({
  label,
  value,
  subline,
  icon: Icon,
  tone = "default",
  onPress,
}: KpiCardProps) {
  const { colors } = useTheme();

  const iconColor =
    tone === "warning" ? colors.warning.DEFAULT : colors.primary.DEFAULT;

  const content = (
    <View
      style={{
        padding: 16,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.card.DEFAULT,
        minHeight: 110,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: colors.muted.foreground,
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.2,
            flex: 1,
            marginRight: 8,
          }}
        >
          {label}
        </Text>

        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.md,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: withAlpha(iconColor, 0.14),
          }}
        >
          <Icon size={18} color={iconColor} strokeWidth={2} />
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text
          numberOfLines={1}
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 22,
            fontWeight: "800",
            letterSpacing: -0.5,
          }}
        >
          {value}
        </Text>

        {subline ? (
          <Text
            numberOfLines={1}
            style={{
              color: colors.muted.foreground,
              fontSize: 11,
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            {subline}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}${subline ? `, ${subline}` : ""}`}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={`${label}: ${value}${subline ? `, ${subline}` : ""}`}
    >
      {content}
    </View>
  );
}

export default memo(KpiCard);

