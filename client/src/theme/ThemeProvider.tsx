import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { vars, colorScheme } from "nativewind";

import { colors as darkColors } from "./colors";
import { lightColors } from "./light";
import type { Palette } from "./palette";
import { getCssVariablesForPalette } from "./tokens";

void SplashScreen.preventAutoHideAsync().catch(() => {});

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "app.theme-mode";

interface ThemeContextValue {
    mode: ThemeMode;
    isDark: boolean;
    colors: Palette;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>("dark");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        AsyncStorage.getItem(STORAGE_KEY)
            .then((stored) => {
                if (active && (stored === "light" || stored === "dark")) {
                    setModeState(stored);
                }
            })
            .catch(() => { })
            .finally(() => {
                if (active) setReady(true);
            });
        return () => {
            active = false;
        };
    }, []);

    const setMode = useCallback((next: ThemeMode) => {
        setModeState(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => { });
    }, []);

    const toggleTheme = useCallback(
        () => setMode(mode === "dark" ? "light" : "dark"),
        [mode, setMode]
    );

    const value = useMemo<ThemeContextValue>(
        () => ({
            mode,
            isDark: mode === "dark",
            colors: mode === "dark" ? darkColors : lightColors,
            setMode,
            toggleTheme,
        }),
        [mode, setMode, toggleTheme]
    );

    useEffect(() => {
        colorScheme.set(mode);
    }, [mode]);

    useEffect(() => {
        if (ready) {
            void SplashScreen.hideAsync().catch(() => {});
        }
    }, [ready]);

    const themeVars = useMemo(() => {
        const activePalette = mode === "dark" ? darkColors : lightColors;
        return vars(getCssVariablesForPalette(activePalette));
    }, [mode]);

    // Avoid a flash of the wrong theme while the saved choice loads
    if (!ready) {
        return <View style={{ flex: 1, backgroundColor: darkColors.background }} />;
    }

    return (
        <ThemeContext.Provider value={value}>
            <View style={[{ flex: 1, backgroundColor: value.colors.background }, themeVars]}>
                {children}
            </View>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
    return ctx;
}