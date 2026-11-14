import { View, Text } from "react-native";
import { useTheme } from "@/theme";

export interface AccountStatProps {
  value: number;
  label: string;
}

export default function AccountStat({ value, label }: AccountStatProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 16 }}>
      <Text
        style={{
          color: colors.foreground.DEFAULT,
          fontSize: 22,
          fontWeight: "800",
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
      <Text style={{ color: colors.muted.foreground, fontSize: 12, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

