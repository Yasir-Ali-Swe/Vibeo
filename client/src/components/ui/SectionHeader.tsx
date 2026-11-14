import { View, Text, Pressable } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useTheme } from "@/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllText?: string;
  onViewAll?: () => void;
  actionText?: string;
  onActionPress?: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllText = "View All",
  onViewAll,
  actionText,
  onActionPress,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  const handleAction = onViewAll || onActionPress;
  const label = actionText || viewAllText;

  return (
    <View className="flex-row items-end justify-between px-4 mb-3.5">
      <View className="flex-1 pr-3">
        <Text className="text-xl font-bold text-foreground tracking-tight">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-muted-foreground mt-1 leading-4">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {handleAction ? (
        <Pressable
          onPress={handleAction}
          hitSlop={8}
          className="flex-row items-center gap-1 active:opacity-70 pb-0.5"
        >
          <Text className="text-xs font-semibold text-primary">
            {label}
          </Text>
          <ArrowRight size={13} color={colors.primary.DEFAULT} strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </View>
  );
}

