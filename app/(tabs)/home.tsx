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
import { DollarSign, Bluetooth, RefreshCw, MapPin } from "lucide-react-native";
import { useAppState } from "@/hooks/useAppState";
import { useTextSize } from "@/hooks/useTextSize";
import { useLanguage } from "@/hooks/useLanguage";



export default function HomeScreen() {
  const { state } = useAppState();
  const insets = useSafeAreaInsets();
  const { getScaledFontSize } = useTextSize();
  const { t } = useLanguage();
  
  const daysRemaining = Math.ceil(state.creditRemaining / (state.rateNow / 100));
  const isLowCredit = state.creditRemaining < 20;

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <View style={styles.creditSection}>
          <DollarSign 
            color={isLowCredit ? "#DC2626" : "#059669"} 
            size={80} 
            strokeWidth={3}
          />
          
          <Text style={[styles.creditLabel, { fontSize: getScaledFontSize(28) }]}>{t.moneyLeft}</Text>
          
          <Text style={[styles.creditAmount, isLowCredit && styles.creditAmountLow, { fontSize: getScaledFontSize(72) }]}>
            ${state.creditRemaining.toFixed(0)}
          </Text>
          
          <Text style={[styles.daysRemaining, { fontSize: getScaledFontSize(24) }]}>
            {t.aboutDaysLeft} {daysRemaining} {daysRemaining === 1 ? t.day : t.days} left
          </Text>

          {isLowCredit && (
            <View style={styles.warningBadge}>
              <Text style={[styles.warningText, { fontSize: getScaledFontSize(20) }]}>{t.lowAddCreditSoon}</Text>
            </View>
          )}
        </View>

        <View style={styles.usageSection}>
          <Text style={[styles.usageLabel, { fontSize: getScaledFontSize(24) }]}>{t.today}</Text>
          <Text style={[styles.usageValue, { fontSize: getScaledFontSize(56) }]}>{state.todayKwh.toFixed(1)} {t.kWh}</Text>
        </View>

        <View style={styles.bluetoothSection}>
          <Text style={[styles.sectionTitle, { fontSize: getScaledFontSize(20) }]}>{t.deviceConnection}</Text>
          
          <View style={styles.connectionCard}>
            <View style={styles.connectionHeader}>
              <Bluetooth 
                color={state.bleConnected ? "#10B981" : "#6B7280"} 
                size={32} 
                strokeWidth={2.5}
              />
              <View style={styles.connectionInfo}>
                <Text style={[styles.connectionLabel, { fontSize: getScaledFontSize(18) }]}>{t.bluetooth}</Text>
                <Text style={[
                  styles.connectionStatus,
                  { fontSize: getScaledFontSize(22) },
                  state.bleConnected ? styles.connected : styles.disconnected
                ]}>
                  {state.bleConnected ? t.connected : t.disconnected}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => router.push("/sensor-setup")}
              activeOpacity={0.8}
            >
              <Text style={[styles.setupButtonText, { fontSize: getScaledFontSize(16) }]}>
                {state.bleConnected ? t.manageDevice : t.connectDevice}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.syncButton}
            onPress={() => router.push("/sync-now")}
            activeOpacity={0.8}
          >
            <RefreshCw color="#0284C7" size={24} strokeWidth={2.5} />
            <Text style={[styles.syncButtonText, { fontSize: getScaledFontSize(20) }]}>{t.syncNow}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.rechargeButton}
          onPress={() => router.push("/add-credit")}
          activeOpacity={0.8}
        >
          <MapPin color="#FFFFFF" size={40} strokeWidth={3} />
          <Text style={[styles.rechargeText, { fontSize: getScaledFontSize(32) }]}>{t.recharge}</Text>
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
    gap: 32,
  },
  creditSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  creditLabel: {
    fontSize: 28,
    fontWeight: "700",
    color: "#374151",
    marginTop: 24,
    marginBottom: 16,
  },
  creditAmount: {
    fontSize: 72,
    fontWeight: "900",
    color: "#059669",
    marginBottom: 12,
  },
  creditAmountLow: {
    color: "#DC2626",
  },
  daysRemaining: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  warningBadge: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#DC2626",
  },
  warningText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#DC2626",
    textTransform: "uppercase",
  },
  usageSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "#F0F9FF",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#BAE6FD",
  },
  usageLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0369A1",
    marginBottom: 12,
  },
  usageValue: {
    fontSize: 56,
    fontWeight: "900",
    color: "#0284C7",
  },
  bluetoothSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  connectionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#E5E7EB",
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
    color: "#374151",
    marginBottom: 4,
  },
  connectionStatus: {
    fontSize: 22,
    fontWeight: "800",
  },
  connected: {
    color: "#10B981",
  },
  disconnected: {
    color: "#6B7280",
  },
  setupButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#BAE6FD",
  },
  syncButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0284C7",
  },
  rechargeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 28,
    paddingHorizontal: 32,
    backgroundColor: "#059669",
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