import React, { useState } from "react";
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



export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedTextSize, setSelectedTextSize] = useState("Medium");

  const showLanguageOptions = () => {
    Alert.alert(
      "Language",
      "Choose language",
      [
        { text: "English", onPress: () => setSelectedLanguage("English") },
        { text: "Pitjantjatjara", onPress: () => setSelectedLanguage("Pitjantjatjara") },
        { text: "Warlpiri", onPress: () => setSelectedLanguage("Warlpiri") },
        { text: "Arrernte", onPress: () => setSelectedLanguage("Arrernte") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const showTextSizeOptions = () => {
    Alert.alert(
      "Text Size",
      "Choose text size",
      [
        { text: "Small", onPress: () => setSelectedTextSize("Small") },
        { text: "Medium", onPress: () => setSelectedTextSize("Medium") },
        { text: "Large", onPress: () => setSelectedTextSize("Large") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };



  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={showLanguageOptions}
          activeOpacity={0.8}
        >
          <Globe color="#059669" size={48} strokeWidth={3} />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>{selectedLanguage}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={showTextSizeOptions}
          activeOpacity={0.8}
        >
          <Type color="#0284C7" size={48} strokeWidth={3} />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Text Size</Text>
            <Text style={styles.settingValue}>{selectedTextSize}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => Alert.alert("Help", "Contact your community energy office for help")}
          activeOpacity={0.8}
        >
          <HelpCircle color="#DC2626" size={48} strokeWidth={3} />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Help</Text>
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