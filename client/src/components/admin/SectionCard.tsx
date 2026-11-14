import type { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme, radius } from "@/theme";

export interface SectionCardProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  children: ReactNode;
}

export default function SectionCard({
  title,
  actionText,
  onAction,
  children,
}: SectionCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        backgroundColor: colors.card.DEFAULT,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            color: colors.foreground.DEFAULT,
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: -0.2,
          }}
        >
          {title}
        </Text>

        {actionText && onAction ? (
          <Pressable
            onPress={onAction}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={actionText}
          >
            <Text
              style={{
                color: colors.primary.DEFAULT,
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              {actionText}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {children}
    </View>
  );
}

