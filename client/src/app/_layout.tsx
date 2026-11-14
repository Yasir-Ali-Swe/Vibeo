import { useEffect, useMemo } from "react";
import { Platform } from "react-native";
import { Stack, DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import * as SystemUI from "expo-system-ui";

import { store, StorePersistGate } from "@/store";
import { ThemeProvider, useTheme } from "@/theme";
import "../global.css";

function RootStack() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background).catch(() => { });
  }, [colors.background]);

  const navTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      dark: isDark,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary.DEFAULT,
        background: colors.background,
        card: colors.card.DEFAULT,
        text: colors.foreground.DEFAULT,
        border: colors.border.DEFAULT,
        notification: colors.primary.DEFAULT,
      },
    };
  }, [isDark, colors]);

  const headerOptions = {
    headerShown: true,
    headerBackTitle: "Back",
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.foreground.DEFAULT,
    headerTitleStyle: {
      color: colors.foreground.DEFAULT,
      fontWeight: "600" as const,
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {Platform.OS === "android" && <NavigationBar style={isDark ? "dark" : "light"} />}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="products" options={{ title: "Products" }} />
        <Stack.Screen name="products/[id]" options={{ title: "Product Details" }} />
        <Stack.Screen name="search" options={{ title: "Search" }} />
        <Stack.Screen
          name="notifications/index"
          options={{ ...headerOptions, title: "Notifications" }}
        />
        <Stack.Screen
          name="profile/index"
          options={{ ...headerOptions, title: "Profile" }}
        />
        <Stack.Screen
          name="orders/index"
          options={{ ...headerOptions, title: "My Orders" }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{ ...headerOptions, title: "Order Details" }}
        />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StorePersistGate>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ThemeProvider>
              <RootStack />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </StorePersistGate>
    </Provider>
  );
}