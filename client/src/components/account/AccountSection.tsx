import type { ReactNode } from "react";
import { View, Text } from "react-native";
import { useTheme, radius } from "@/theme";

export interface AccountSectionProps {
  title: string;
  children: ReactNode;
}

export default function AccountSection({ title, children }: AccountSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={{ marginTop: 28 }}>
      <Text
        style={{
          color: colors.muted.foreground,
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginBottom: 10,
          marginLeft: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.card.DEFAULT,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

