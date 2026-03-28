import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { DollarSign, Bluetooth, RefreshCw, CreditCard, Sun, Moon } from "lucide-react-native";
import { useAppState } from "@/hooks/useAppState";
import { useTextSize } from "@/hooks/useTextSize";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";



export default function HomeScreen() {
  const { state } = useAppState();
  const insets = useSafeAreaInsets();
  const { getScaledFontSize } = useTextSize();
  const { t } = useLanguage();
  const { theme, toggleTheme, colors } = useTheme();
  
  const daysRemaining = Math.ceil(state.creditRemaining / (state.rateNow / 100));
  const isLowCredit = state.creditRemaining < 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          {theme === "light" ? (
            <Moon color={colors.text} size={32} strokeWidth={2.5} />
          ) : (
            <Sun color={colors.text} size={32} strokeWidth={2.5} />
          )}
        </TouchableOpacity>

        <View style={[styles.creditSection, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <DollarSign 
            color={isLowCredit ? "#DC2626" : "#059669"} 
            size={80} 
            strokeWidth={3}
          />
          
          <Text style={[styles.creditLabel, { fontSize: getScaledFontSize(28), color: colors.textSecondary }]}>{t.moneyLeft}</Text>
          
          <Text style={[styles.creditAmount, { fontSize: getScaledFontSize(72), color: isLowCredit ? colors.error : colors.success }]}>
            ${state.creditRemaining.toFixed(0)}
          </Text>
          
          <Text style={[styles.daysRemaining, { fontSize: getScaledFontSize(24), color: colors.textTertiary }]}>
            {t.aboutDaysLeft} {daysRemaining} {daysRemaining === 1 ? t.day : t.days} left
          </Text>

          {isLowCredit && (
            <View style={[styles.warningBadge, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
              <Text style={[styles.warningText, { fontSize: getScaledFontSize(20), color: colors.error }]}>{t.lowAddCreditSoon}</Text>
            </View>
          )}
        </View>

        <View style={[styles.usageSection, { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder }]}>
          <Text style={[styles.usageLabel, { fontSize: getScaledFontSize(24), color: colors.info }]}>{t.today}</Text>
          <Text style={[styles.usageValue, { fontSize: getScaledFontSize(56), color: colors.primary }]}>{state.todayKwh.toFixed(1)} {t.kWh}</Text>
        </View>

        <View style={styles.bluetoothSection}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20), color: colors.text }]}>{t.deviceConnection}</Text>
          
          <View style={[styles.connectionCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <View style={styles.connectionHeader}>
              <Bluetooth 
                color={state.bleConnected ? "#10B981" : "#6B7280"} 
                size={32} 
                strokeWidth={2.5}
              />
              <View style={styles.connectionInfo}>
                <Text style={[styles.connectionLabel, { fontSize: getScaledFontSize(18), color: colors.textSecondary }]}>{t.bluetooth}</Text>
                <Text style={[
                  styles.connectionStatus,
                  { fontSize: getScaledFontSize(22), color: state.bleConnected ? colors.iconActive : colors.textTertiary }
                ]}>
                  {state.bleConnected ? t.connected : t.disconnected}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.setupButton, { backgroundColor: colors.background, borderColor: colors.surfaceBorder }]}
              onPress={() => router.push("/sensor-setup")}
              activeOpacity={0.8}
            >
              <Text style={[styles.setupButtonText, { fontSize: getScaledFontSize(16), color: colors.textSecondary }]}>
                {state.bleConnected ? t.manageDevice : t.connectDevice}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.syncButton, { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder }]}
            onPress={() => router.push("/sync-now")}
            activeOpacity={0.8}
          >
            <RefreshCw color={colors.primary} size={24} strokeWidth={2.5} />
            <Text style={[styles.syncButtonText, { fontSize: getScaledFontSize(20), color: colors.primary }]}>{t.syncNow}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.rechargeButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/add-credit")}
          activeOpacity={0.8}
        >
          <CreditCard color="#FFFFFF" size={40} strokeWidth={3} />
          <Text style={[styles.rechargeText, { fontSize: getScaledFontSize(32) }]}>{t.recharge}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    alignSelf: "flex-end",
    padding: 12,
    marginBottom: 8,
  },
  scrollContent: {
    padding: 24,
    gap: 32,
  },
  creditSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 3,
  },
  creditLabel: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 16,
  },
  creditAmount: {
    fontSize: 72,
    fontWeight: "900",
    marginBottom: 12,
  },
  daysRemaining: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  warningBadge: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  warningText: {
    fontSize: 20,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  usageSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 3,
  },
  usageLabel: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  usageValue: {
    fontSize: 56,
    fontWeight: "900",
  },
  bluetoothSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  connectionCard: {
    borderRadius: 20,
    borderWidth: 3,
    padding: 20,
    gap: 16,
  },
  connectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  connectionStatus: {
    fontSize: 22,
    fontWeight: "800",
  },
  setupButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 3,
  },
  syncButtonText: {
    fontSize: 20,
    fontWeight: "700",
  },
  rechargeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 20,
    minHeight: 88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  rechargeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});