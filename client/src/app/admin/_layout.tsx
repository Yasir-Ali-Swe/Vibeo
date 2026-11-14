import { Stack } from "expo-router";
import AdminGuard from "@/components/admin/AdminGuard";
import { useTheme } from "@/theme";

export default function AdminLayout() {
  const { colors } = useTheme();

  return (
    <AdminGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/new"
          options={{
            headerShown: true,
            title: "Add product",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground.DEFAULT,
            headerTitleStyle: {
              color: colors.foreground.DEFAULT,
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="products/[id]"
          options={{
            headerShown: true,
            title: "Edit product",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground.DEFAULT,
            headerTitleStyle: {
              color: colors.foreground.DEFAULT,
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="products/collections"
          options={{
            headerShown: true,
            title: "Homepage collections",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground.DEFAULT,
            headerTitleStyle: {
              color: colors.foreground.DEFAULT,
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            headerShown: true,
            title: "Order details",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.foreground.DEFAULT,
            headerTitleStyle: {
              color: colors.foreground.DEFAULT,
              fontWeight: "600",
            },
          }}
        />
      </Stack>
    </AdminGuard>
  );
}

