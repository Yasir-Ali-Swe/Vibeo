import { View, Text } from "react-native";
import { useTheme } from "@/theme";

export interface SummaryRowProps {
  label: string;
  value: string;
  valueColor?: string;
  topSpace?: boolean;
}

export default function SummaryRow({
  label,
  value,
  valueColor,
  topSpace = true,
}: SummaryRowProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: topSpace ? 10 : 0,
      }}
    >
      <Text style={{ color: colors.muted.foreground, fontSize: 13 }}>{label}</Text>
      <Text
        style={{
          color: valueColor ?? colors.foreground.DEFAULT,
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

