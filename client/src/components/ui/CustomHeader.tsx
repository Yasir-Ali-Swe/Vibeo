import { View, Text, Pressable } from "react-native";
import { Bell } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import UserAvatar from "react-native-user-avatar";
import { useTheme } from "@/theme";
import { useAppSelector, selectUnreadNotificationsCount } from "@/store";

export default function CustomHeader() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);

  return (
    <View
      className="bg-background"
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className="px-4 h-[60px] flex-row items-center justify-between border-b border-border">
        {/* App Logo & Name */}
        <Pressable
          onPress={() => router.navigate("/(tabs)")}
          className="flex-row items-center gap-1.5"
          accessibilityRole="button"
          accessibilityLabel="Vibeo Home"
        >
          <Text className="text-2xl font-black text-primary tracking-tight">
            ESHOP
          </Text>
        </Pressable>

        {/* Header Actions */}
        <View className="flex-row items-center gap-4">
          {/* Notifications */}
          <Pressable
            onPress={() => router.push("/notifications")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            className="w-9 h-9 rounded-full bg-surface border border-border items-center justify-center active:opacity-70"
          >
            <Bell size={18} color={colors.muted.foreground} strokeWidth={2} />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 7,
                  right: 7,
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: colors.primary.DEFAULT,
                }}
              />
            )}
          </Pressable>
          {/* User Profile */}
          <Pressable
            onPress={() => router.push("/profile")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="My Profile"
            className="active:opacity-80"
          >
            <UserAvatar
              size={30}
              name="Yasir Ali"
              bgColor={colors.surface.elevated}
              textColor={colors.foreground.DEFAULT}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
