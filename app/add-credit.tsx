import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, MapPin, Navigation } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

export default function RechargeModal() {
  const { t } = useLanguage();
  const { colors } = useTheme();
  
  const handleOpenMaps = async () => {
    if (Platform.OS !== "web") {
      await Haptics.selectionAsync();
    }

    const query = "charging station";
    let url = "";

    if (Platform.OS === "ios") {
      url = `maps://app?q=${encodeURIComponent(query)}`;
    } else if (Platform.OS === "android") {
      url = `geo:0,0?q=${encodeURIComponent(query)}`;
    } else {
      url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const fallbackUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
        await Linking.openURL(fallbackUrl);
      }
    } catch {
      Alert.alert(
        "Error",
        "Could not open maps. Please search for charging stations manually."
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.surfaceBorder }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color={colors.textTertiary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{t.recharge}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <MapPin color={colors.success} size={80} strokeWidth={2.5} />
          </View>

          <Text style={[styles.mainTitle, { color: colors.text }]}>{t.findChargingStations}</Text>
          
          <Text style={[styles.description, { color: colors.textTertiary }]}>
            {t.toRechargeYourAccount}
          </Text>

          <View style={[styles.infoBox, { backgroundColor: colors.successLight, borderColor: colors.successBorder }]}>
            <Navigation color={colors.success} size={24} />
            <Text style={[styles.infoText, { color: colors.success }]}>
              {t.tapButtonBelowToOpenMaps}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.mapsButton, { backgroundColor: colors.success }]}
            onPress={handleOpenMaps}
            activeOpacity={0.8}
          >
            <MapPin color="#FFFFFF" size={24} />
            <Text style={styles.mapsButtonText}>{t.openMaps}</Text>
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            {t.onceAtChargingStation}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    borderRadius: 16,
    gap: 16,
    marginBottom: 40,
    borderWidth: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  mapsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    gap: 12,
    marginBottom: 32,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  mapsButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});