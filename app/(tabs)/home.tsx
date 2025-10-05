import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { DollarSign, MapPin, Bluetooth, RefreshCw } from "lucide-react-native";
import { useAppState } from "@/hooks/useAppState";



export default function HomeScreen() {
  const { state } = useAppState();
  const insets = useSafeAreaInsets();
  
  const daysRemaining = Math.ceil(state.creditRemaining / (state.rateNow / 100));
  const isLowCredit = state.creditRemaining < 20;

  const openMapsForChargingStations = () => {
    const url = Platform.select({
      ios: 'maps:?q=charging+station',
      android: 'geo:0,0?q=charging+station',
      web: 'https://www.google.com/maps/search/charging+station'
    });
    
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url as string).catch(() => {
        Alert.alert('Error', 'Unable to open maps');
      });
    }
  };

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
          
          <Text style={styles.creditLabel}>Money Left</Text>
          
          <Text style={[styles.creditAmount, isLowCredit && styles.creditAmountLow]}>
            ${state.creditRemaining.toFixed(0)}
          </Text>
          
          <Text style={styles.daysRemaining}>
            About {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
          </Text>

          {isLowCredit && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningText}>LOW - Add credit soon</Text>
            </View>
          )}
        </View>

        <View style={styles.usageSection}>
          <Text style={styles.usageLabel}>Today</Text>
          <Text style={styles.usageValue}>{state.todayKwh.toFixed(1)} kWh</Text>
        </View>

        <View style={styles.connectionSection}>
          <View style={styles.connectionRow}>
            <View style={styles.connectionItem}>
              <Bluetooth 
                color={state.bleConnected ? "#10B981" : "#6B7280"} 
                size={32} 
                strokeWidth={3}
              />
              <Text style={styles.connectionLabel}>Bluetooth</Text>
              <View style={[
                styles.statusBadge,
                state.bleConnected ? styles.statusConnected : styles.statusDisconnected
              ]}>
                <Text style={[
                  styles.statusText,
                  state.bleConnected ? styles.statusTextConnected : styles.statusTextDisconnected
                ]}>
                  {state.bleConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.setupButton}
                onPress={() => router.push("/sensor-setup")}
                activeOpacity={0.8}
              >
                <Text style={styles.setupButtonText}>Setup</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.connectionItem}>
              <RefreshCw color="#0284C7" size={32} strokeWidth={3} />
              <Text style={styles.connectionLabel}>Sync</Text>
              <Text style={styles.lastSyncText}>
                {Math.floor((Date.now() - state.lastSynced) / (1000 * 60 * 60))}h ago
              </Text>
              <TouchableOpacity
                style={styles.syncButton}
                onPress={() => router.push("/sync-now")}
                activeOpacity={0.8}
              >
                <Text style={styles.syncButtonText}>Sync Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.rechargeButton}
          onPress={openMapsForChargingStations}
          activeOpacity={0.8}
        >
          <MapPin color="#FFFFFF" size={40} strokeWidth={3} />
          <Text style={styles.rechargeText}>Find Recharge Station</Text>
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
  connectionSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    padding: 24,
  },
  connectionRow: {
    flexDirection: "row",
    gap: 16,
  },
  connectionItem: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  connectionLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  statusConnected: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
  },
  statusDisconnected: {
    backgroundColor: "#F3F4F6",
    borderColor: "#9CA3AF",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusTextConnected: {
    color: "#10B981",
  },
  statusTextDisconnected: {
    color: "#6B7280",
  },
  setupButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
  },
  setupButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  lastSyncText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  syncButton: {
    backgroundColor: "#0284C7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
  },
  syncButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  rechargeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 28,
    paddingHorizontal: 32,
    backgroundColor: "#DC2626",
    borderRadius: 20,
    minHeight: 88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  rechargeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});