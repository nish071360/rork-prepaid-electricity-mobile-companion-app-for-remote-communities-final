import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

const THEME_STORAGE_KEY = "@app_theme";

export type Theme = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  primaryBorder: string;
  success: string;
  successLight: string;
  successBorder: string;
  warning: string;
  warningLight: string;
  warningBorder: string;
  error: string;
  errorLight: string;
  errorBorder: string;
  info: string;
  infoLight: string;
  infoBorder: string;
  cardBackground: string;
  cardBorder: string;
  icon: string;
  iconActive: string;
}

const lightTheme: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F9FAFB",
  surfaceBorder: "#E5E7EB",
  text: "#111827",
  textSecondary: "#374151",
  textTertiary: "#6B7280",
  primary: "#0284C7",
  primaryLight: "#F0F9FF",
  primaryBorder: "#BAE6FD",
  success: "#059669",
  successLight: "#D1FAE5",
  successBorder: "#10B981",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  warningBorder: "#FBBF24",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  errorBorder: "#EF4444",
  info: "#0369A1",
  infoLight: "#F0F9FF",
  infoBorder: "#BAE6FD",
  cardBackground: "#F9FAFB",
  cardBorder: "#E5E7EB",
  icon: "#6B7280",
  iconActive: "#10B981",
};

const darkTheme: ThemeColors = {
  background: "#111827",
  surface: "#1F2937",
  surfaceBorder: "#374151",
  text: "#F9FAFB",
  textSecondary: "#E5E7EB",
  textTertiary: "#9CA3AF",
  primary: "#38BDF8",
  primaryLight: "#1E3A8A",
  primaryBorder: "#3B82F6",
  success: "#10B981",
  successLight: "#064E3B",
  successBorder: "#059669",
  warning: "#FBBF24",
  warningLight: "#78350F",
  warningBorder: "#F59E0B",
  error: "#EF4444",
  errorLight: "#7F1D1D",
  errorBorder: "#DC2626",
  info: "#38BDF8",
  infoLight: "#1E3A8A",
  infoBorder: "#3B82F6",
  cardBackground: "#1F2937",
  cardBorder: "#374151",
  icon: "#9CA3AF",
  iconActive: "#10B981",
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === "light" || stored === "dark")) {
        setThemeState(stored as Theme);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
      console.log("Theme changed to:", newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme, setTheme]);

  const colors: ThemeColors = theme === "light" ? lightTheme : darkTheme;

  return useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    colors,
    isLoading,
  }), [theme, setTheme, toggleTheme, colors, isLoading]);
});
