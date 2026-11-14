import type { ReactNode } from "react";
import { View, Text } from "react-native";
import { useTheme, radius } from "@/theme";

export interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  const { colors } = useTheme();

  return (
    <View style={{ marginTop: 20 }}>
      {title ? (
        <Text
          style={{
            color: colors.muted.foreground,
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          padding: 16,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.card.DEFAULT,
        }}
      >
        {children}
      </View>
    </View>
  );
}

