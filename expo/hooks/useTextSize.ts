import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

export type TextSize = "Small" | "Medium" | "Large";

const TEXT_SIZE_KEY = "@text_size";

const TEXT_SIZE_MULTIPLIERS = {
  Small: 0.85,
  Medium: 1,
  Large: 1.2,
} as const;

export const [TextSizeProvider, useTextSize] = createContextHook(() => {
  const [textSize, setTextSizeState] = useState<TextSize>("Medium");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTextSize();
  }, []);

  const loadTextSize = async () => {
    try {
      const stored = await AsyncStorage.getItem(TEXT_SIZE_KEY);
      if (stored && (stored === "Small" || stored === "Medium" || stored === "Large")) {
        setTextSizeState(stored as TextSize);
      }
    } catch (error) {
      console.error("Failed to load text size:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTextSize = useCallback(async (size: TextSize) => {
    try {
      await AsyncStorage.setItem(TEXT_SIZE_KEY, size);
      setTextSizeState(size);
      console.log("Text size updated to:", size);
    } catch (error) {
      console.error("Failed to save text size:", error);
    }
  }, []);

  const getScaledFontSize = useCallback((baseSize: number): number => {
    return baseSize * TEXT_SIZE_MULTIPLIERS[textSize];
  }, [textSize]);

  return useMemo(() => ({
    textSize,
    setTextSize,
    getScaledFontSize,
    isLoaded,
  }), [textSize, setTextSize, getScaledFontSize, isLoaded]);
});
