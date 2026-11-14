import { Tabs, router } from "expo-router";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Store,
} from "lucide-react-native";
import { useTheme } from "@/theme";

export default function AdminTabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBackToStore = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const renderStoreButton = () => (
    <Pressable
      onPress={handleBackToStore}
      accessibilityRole="button"
      accessibilityLabel="Back to customer store"
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 6,
      }}
    >
      <Store size={18} color={colors.primary.DEFAULT} strokeWidth={2} />
      <Text
        style={{
          color: colors.primary.DEFAULT,
          fontSize: 14,
          fontWeight: "700",
          marginLeft: 6,
        }}
      >
        Store
      </Text>
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground.DEFAULT,
        headerTitleStyle: {
          color: colors.foreground.DEFAULT,
          fontWeight: "700",
          fontSize: 17,
        },
        headerLeft: renderStoreButton,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.muted.foreground,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: { marginTop: 4 },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border.DEFAULT,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 5),
          height: 52 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboard
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarLabel: "Products",
          tabBarIcon: ({ color, focused }) => (
            <Package
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}

