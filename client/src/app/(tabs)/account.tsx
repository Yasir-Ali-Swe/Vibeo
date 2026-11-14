import { View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  ShoppingBag,
  Bell,
  Moon,
  Sun,
  Pencil,
  LayoutDashboard,
} from "lucide-react-native";

import AccountMenuItem from "@/components/account/AccountMenuItem";
import AccountSection from "@/components/account/AccountSection";
import AccountStat from "@/components/account/AccountStat";
import ThemeOption from "@/components/account/ThemeOption";
import {
  useAppSelector,
  selectIsAdmin,
  selectCurrentUser,
  selectCustomerTotalOrdersCount,
  selectCustomerActiveOrdersCount,
  selectCustomerCompletedOrdersCount,
  selectUnreadNotificationsCount,
} from "@/store";
import { useTheme, radius } from "@/theme";
import { withAlpha } from "@/utils/color";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Account() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isAdmin = useAppSelector(selectIsAdmin);
  const currentUser = useAppSelector(selectCurrentUser);

  const totalOrders = useAppSelector(selectCustomerTotalOrdersCount(currentUser.id));
  const activeOrders = useAppSelector(selectCustomerActiveOrdersCount(currentUser.id));
  const completedOrders = useAppSelector(selectCustomerCompletedOrdersCount(currentUser.id));
  const unreadNotifications = useAppSelector(selectUnreadNotificationsCount);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: insets.top + 20,
        paddingBottom: 40,
      }}
    >
      {/* Title */}
      <Text
        style={{
          color: colors.foreground.DEFAULT,
          fontSize: 30,
          fontWeight: "800",
          letterSpacing: -0.8,
        }}
      >
        Account
      </Text>

      {/* Profile card */}
      <View
        style={{
          marginTop: 20,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          overflow: "hidden",
          backgroundColor: colors.card.DEFAULT,
        }}
      >
        <LinearGradient
          pointerEvents="none"
          colors={[withAlpha(colors.primary.DEFAULT, 0.2), withAlpha(colors.primary.DEFAULT, 0)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <View style={{ padding: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Avatar with accent ring */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: radius.full,
                padding: 3,
                borderWidth: 2,
                borderColor: colors.primary.DEFAULT,
                marginRight: 16,
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: radius.full,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.surface.elevated,
                }}
              >
                {(currentUser.photo || currentUser.avatarUrl) ? (
                  <Image
                    source={{ uri: (currentUser.photo || currentUser.avatarUrl)! }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                ) : getInitials(currentUser.name) ? (
                  <Text
                    style={{
                      color: colors.foreground.DEFAULT,
                      fontSize: 22,
                      fontWeight: "800",
                    }}
                  >
                    {getInitials(currentUser.name)}
                  </Text>
                ) : (
                  <User size={28} color={colors.muted.subtle} strokeWidth={1.75} />
                )}
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 20,
                  fontWeight: "800",
                  letterSpacing: -0.3,
                }}
              >
                {currentUser.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{ color: colors.muted.foreground, fontSize: 13, marginTop: 4 }}
              >
                {currentUser.phone}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/profile")}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            style={({ pressed }) => ({
              height: 44,
              marginTop: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.strong,
              backgroundColor: pressed ? colors.surface.elevated : colors.surface.DEFAULT,
            })}
          >
            <View className="flex items-center flex-row mt-2">
              <Pencil size={15} color={colors.foreground.DEFAULT} strokeWidth={2.25} />
              <Text
                style={{
                  color: colors.foreground.DEFAULT,
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 4,
                }}
              >
                Edit profile
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 14,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.card.DEFAULT,
        }}
      >
        <AccountStat value={totalOrders} label="Orders" />
        <View style={{ width: 1, marginVertical: 14, backgroundColor: colors.border.DEFAULT }} />
        <AccountStat value={activeOrders} label="In progress" />
        <View style={{ width: 1, marginVertical: 14, backgroundColor: colors.border.DEFAULT }} />
        <AccountStat value={completedOrders} label="Delivered" />
      </View>

      {/* Menu */}
      <AccountSection title="Shopping">
        <AccountMenuItem
          icon={ShoppingBag}
          title="My Orders"
          subtitle="Track, view and manage orders"
          badge={activeOrders}
          onPress={() => router.push("/orders")}
        />
        <AccountMenuItem
          icon={User}
          title="My Profile"
          subtitle="Name, phone and address"
          onPress={() => router.push("/profile")}
        />
        <AccountMenuItem
          icon={Bell}
          title="Notifications"
          subtitle="Offers and order updates"
          badge={unreadNotifications}
          onPress={() => router.push("/notifications")}
          isLast
        />
      </AccountSection>

      {/* Administration */}
      {isAdmin && (
        <AccountSection title="Administration">
          <AccountMenuItem
            icon={LayoutDashboard}
            title="Admin Dashboard"
            subtitle="Overview, catalog & orders"
            onPress={() => router.push("/admin" as any)}
            isLast
          />
        </AccountSection>
      )}

      {/* Appearance */}
      <AccountSection title="Appearance">
        <View style={{ padding: 14 }}>
          <View
            style={{
              flexDirection: "row",
              padding: 4,
              borderRadius: radius.md,
              backgroundColor: colors.surface.elevated,
            }}
          >
            <ThemeOption mode="light" label="Light" icon={Sun} />
            <ThemeOption mode="dark" label="Dark" icon={Moon} />
          </View>
        </View>
      </AccountSection>
    </ScrollView>
  );
}