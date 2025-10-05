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
import { DollarSign, Plus } from "lucide-react-native";
import { useAppState } from "@/hooks/useAppState";



export default function HomeScreen() {
  const { state } = useAppState();
  const insets = useSafeAreaInsets();
  
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

        <TouchableOpacity
          style={styles.addCreditButton}
          onPress={() => router.push("/add-credit")}
          activeOpacity={0.8}
        >
          <Plus color="#FFFFFF" size={40} strokeWidth={3} />
          <Text style={styles.addCreditText}>Add Credit</Text>
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
  addCreditButton: {
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
  addCreditText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});