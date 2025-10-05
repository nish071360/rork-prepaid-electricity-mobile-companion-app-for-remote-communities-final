import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, Language, Translations } from "@/constants/translations";

const LANGUAGE_STORAGE_KEY = "@app_language";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("English");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === "English" || stored === "Yumplatok" || stored === "Kriol")) {
        setLanguageState(stored as Language);
      }
    } catch (error) {
      console.error("Failed to load language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
      console.log("Language changed to:", newLanguage);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  const t: Translations = translations[language];

  return {
    language,
    setLanguage,
    t,
    isLoading,
  };
}
