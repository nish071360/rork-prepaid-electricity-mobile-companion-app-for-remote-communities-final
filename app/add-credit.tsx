import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, MapPin, Navigation, DollarSign, CreditCard } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useTextSize } from "@/hooks/useTextSize";

export default function RechargeModal() {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { addCredit } = useAppState();
  const { getScaledFontSize } = useTextSize();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [10, 20, 50, 100];
  
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

  const handleTopUp = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert(t.error || "Error", t.pleaseEnterValidAmount || "Please enter a valid amount");
      return;
    }

    if (amount > 500) {
      Alert.alert(t.error || "Error", t.maximumTopUpAmount || "Maximum top-up amount is $500");
      return;
    }

    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await addCredit(amount, "manual", "In-app top-up");
      
      Alert.alert(
        t.success || "Success",
        `${t.successfullyAdded || "Successfully added"} ${amount.toFixed(2)} ${t.toYourAccount || "to your account"}`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        t.error || "Error",
        t.failedToAddCredit || "Failed to add credit. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.surfaceBorder }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color={colors.textTertiary} size={24} />
          </TouchableOpacity>
          <Text style={[styles.title, { fontSize: getScaledFontSize(18), color: colors.text }]}>{t.recharge}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <View style={styles.sectionHeader}>
                <DollarSign color={colors.primary} size={32} strokeWidth={2.5} />
                <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(24), color: colors.text }]}>{t.topUpInApp || "Top Up In-App"}</Text>
              </View>

              <Text style={[styles.sectionDescription, { fontSize: getScaledFontSize(16), color: colors.textTertiary }]}>
                {t.addCreditDirectly || "Add credit directly to your account"}
              </Text>

              <View style={styles.quickAmountsContainer}>
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.quickAmountButton,
                      { backgroundColor: colors.background, borderColor: colors.surfaceBorder },
                      selectedAmount === amount && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                    ]}
                    onPress={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                      if (Platform.OS !== "web") {
                        Haptics.selectionAsync();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quickAmountText,
                        { fontSize: getScaledFontSize(20), color: colors.text },
                        selectedAmount === amount && { color: colors.primary, fontWeight: "800" as const },
                      ]}
                    >
                      ${amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.customAmountContainer}>
                <Text style={[styles.customAmountLabel, { fontSize: getScaledFontSize(16), color: colors.textSecondary }]}>
                  {t.orEnterCustomAmount || "Or enter custom amount:"}
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.surfaceBorder }]}>
                  <Text style={[styles.dollarSign, { fontSize: getScaledFontSize(24), color: colors.textTertiary }]}>$</Text>
                  <TextInput
                    style={[styles.input, { fontSize: getScaledFontSize(24), color: colors.text }]}
                    value={customAmount}
                    onChangeText={(text) => {
                      setCustomAmount(text);
                      setSelectedAmount(null);
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.topUpButton,
                  { backgroundColor: colors.primary },
                  isProcessing && { opacity: 0.6 },
                ]}
                onPress={handleTopUp}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                <CreditCard color="#FFFFFF" size={24} />
                <Text style={[styles.topUpButtonText, { fontSize: getScaledFontSize(18) }]}>
                  {isProcessing ? (t.processing || "Processing...") : (t.topUpNow || "Top Up Now")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.surfaceBorder }]} />
              <Text style={[styles.dividerText, { fontSize: getScaledFontSize(14), color: colors.textTertiary }]}>{t.or || "OR"}</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.surfaceBorder }]} />
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
              <View style={styles.sectionHeader}>
                <MapPin color={colors.success} size={32} strokeWidth={2.5} />
                <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(24), color: colors.text }]}>{t.findChargingStations}</Text>
              </View>
              
              <Text style={[styles.sectionDescription, { fontSize: getScaledFontSize(16), color: colors.textTertiary }]}>
                {t.visitNearbyChargingStation || "Visit a nearby charging station or hub to add credit"}
              </Text>

              <View style={[styles.infoBox, { backgroundColor: colors.successLight, borderColor: colors.successBorder }]}>
                <Navigation color={colors.success} size={20} />
                <Text style={[styles.infoText, { fontSize: getScaledFontSize(14), color: colors.success }]}>
                  {t.tapButtonBelowToOpenMaps}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.mapsButton, { backgroundColor: colors.success }]}
                onPress={handleOpenMaps}
                activeOpacity={0.8}
              >
                <MapPin color="#FFFFFF" size={24} />
                <Text style={[styles.mapsButtonText, { fontSize: getScaledFontSize(18) }]}>{t.openMaps}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    fontWeight: "600" as const,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    padding: 24,
    gap: 24,
  },
  section: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    gap: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  quickAmountsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: "45%" as const,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  quickAmountText: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  customAmountContainer: {
    gap: 12,
  },
  customAmountLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: "600" as const,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600" as const,
    paddingVertical: 12,
  },
  topUpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  topUpButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  mapsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  mapsButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});