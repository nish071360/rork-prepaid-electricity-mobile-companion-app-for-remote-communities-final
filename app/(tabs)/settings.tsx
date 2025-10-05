import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Globe, 
  Type,
  HelpCircle,
} from "lucide-react-native";
import { useTextSize } from "@/hooks/useTextSize";
import { useLanguage } from "@/hooks/useLanguage";
import { Language } from "@/constants/translations";



export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLanguage();
  const { textSize, setTextSize, getScaledFontSize } = useTextSize();

  const showLanguageOptions = () => {
    Alert.alert(
      t.language,
      t.chooseLanguage,
      [
        { text: "English", onPress: () => setLanguage("English" as Language) },
        { text: "Yumplatok", onPress: () => setLanguage("Yumplatok" as Language) },
        { text: "Kriol", onPress: () => setLanguage("Kriol" as Language) },
        { text: t.cancel, style: "cancel" },
      ]
    );
  };

  const showTextSizeOptions = () => {
    Alert.alert(
      t.textSize,
      t.chooseTextSize,
      [
        { text: t.small, onPress: () => setTextSize("Small") },
        { text: t.medium, onPress: () => setTextSize("Medium") },
        { text: t.large, onPress: () => setTextSize("Large") },
        { text: t.cancel, style: "cancel" },
      ]
    );
  };



  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <Text style={[styles.title, { fontSize: getScaledFontSize(36) }]}>{t.settings}</Text>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={showLanguageOptions}
          activeOpacity={0.8}
        >
          <Globe color="#059669" size={48} strokeWidth={3} />
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, { fontSize: getScaledFontSize(24) }]}>{t.language}</Text>
            <Text style={[styles.settingValue, { fontSize: getScaledFontSize(28) }]}>{language}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={showTextSizeOptions}
          activeOpacity={0.8}
        >
          <Type color="#0284C7" size={48} strokeWidth={3} />
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, { fontSize: getScaledFontSize(24) }]}>{t.textSize}</Text>
            <Text style={[styles.settingValue, { fontSize: getScaledFontSize(28) }]}>{textSize === "Small" ? t.small : textSize === "Medium" ? t.medium : t.large}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => Alert.alert(t.help, t.helpMessage)}
          activeOpacity={0.8}
        >
          <HelpCircle color="#DC2626" size={48} strokeWidth={3} />
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, { fontSize: getScaledFontSize(24) }]}>{t.help}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 16,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingVertical: 28,
    paddingHorizontal: 28,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    minHeight: 100,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },
});