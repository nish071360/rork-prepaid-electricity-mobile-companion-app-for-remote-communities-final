import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "@/hooks/useAppState";

type TimeRange = "day" | "week" | "month";

export default function HistoryScreen() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("week");
  const { getHistoryData } = useAppState();
  const insets = useSafeAreaInsets();
  
  const historyData = getHistoryData(selectedRange);

  const getTotalUsage = () => {
    return historyData.reduce((sum, value) => sum + value, 0);
  };

  const getAverageUsage = () => {
    return historyData.length > 0 ? getTotalUsage() / historyData.length : 0;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <Text style={styles.title}>Usage</Text>

        <View style={styles.rangeSelector}>
          {(["day", "week", "month"] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                selectedRange === range && styles.activeRangeButton,
              ]}
              onPress={() => setSelectedRange(range)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  selectedRange === range && styles.activeRangeButtonText,
                ]}
              >
                {range === "day" ? "Today" : range === "week" ? "Week" : "Month"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{getTotalUsage().toFixed(1)}</Text>
          <Text style={styles.statUnit}>kWh</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statLabel}>Average per {selectedRange === "day" ? "hour" : "day"}</Text>
          <Text style={styles.statValue}>{getAverageUsage().toFixed(1)}</Text>
          <Text style={styles.statUnit}>kWh</Text>
        </View>
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
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },
  rangeSelector: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 6,
    gap: 6,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 12,
    minHeight: 72,
    justifyContent: "center",
  },
  activeRangeButton: {
    backgroundColor: "#059669",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  rangeButtonText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6B7280",
  },
  activeRangeButtonText: {
    color: "#FFFFFF",
  },
  statsCard: {
    backgroundColor: "#F0F9FF",
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#BAE6FD",
  },
  statLabel: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0369A1",
    marginBottom: 16,
    textAlign: "center",
  },
  statValue: {
    fontSize: 64,
    fontWeight: "900",
    color: "#0284C7",
    marginBottom: 8,
  },
  statUnit: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0369A1",
  },
});