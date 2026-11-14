import { Pressable, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme, radius, type ThemeMode } from "@/theme";

export interface ThemeOptionProps {
  mode: ThemeMode;
  label: string;
  icon: LucideIcon;
}

export default function ThemeOption({ mode, label, icon: Icon }: ThemeOptionProps) {
  const { colors, mode: current, setMode } = useTheme();
  const selected = current === mode;

  return (
    <Pressable
      onPress={() => setMode(mode)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} theme`}
      style={{
        flex: 1,
        height: 42,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.sm,
        backgroundColor: selected ? colors.primary.DEFAULT : "transparent",
      }}
    >
      <Icon
        size={16}
        strokeWidth={2.25}
        color={selected ? colors.primary.foreground : colors.muted.foreground}
      />
      <Text
        style={{
          marginLeft: 8,
          fontSize: 14,
          fontWeight: "700",
          color: selected ? colors.primary.foreground : colors.muted.foreground,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

