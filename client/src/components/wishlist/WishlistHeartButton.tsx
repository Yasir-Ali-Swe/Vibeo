import { Pressable } from "react-native";
import { Heart } from "lucide-react-native";
import { useTheme } from "@/theme";

interface WishlistHeartButtonProps {
  isWishlisted: boolean;
  onPress: () => void;
  size?: number;
}

export default function WishlistHeartButton({
  isWishlisted,
  onPress,
  size = 18,
}: WishlistHeartButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected: isWishlisted }}
      accessibilityLabel={
        isWishlisted ? "Remove from wishlist" : "Add to wishlist"
      }
      className="h-8 w-8 items-center justify-center rounded-full bg-background/75 border border-border/80 active:opacity-70"
    >
      <Heart
        size={size}
        color={isWishlisted ? colors.destructive.DEFAULT : colors.foreground.DEFAULT}
        fill={isWishlisted ? colors.destructive.DEFAULT : "transparent"}
        strokeWidth={2}
      />
    </Pressable>
  );
}
