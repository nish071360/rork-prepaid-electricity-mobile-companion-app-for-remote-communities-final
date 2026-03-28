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
import { useTextSize } from "@/hooks/useTextSize";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

type TimeRange = "day" | "week" | "month";

export default function HistoryScreen() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("week");
  const { getHistoryData } = useAppState();
  const insets = useSafeAreaInsets();
  const { getScaledFontSize } = useTextSize();
  const { t } = useLanguage();
  const { colors } = useTheme();
  
  const historyData = getHistoryData(selectedRange);

  const getTotalUsage = () => {
    return historyData.reduce((sum, value) => sum + value, 0);
  };

  const getAverageUsage = () => {
    return historyData.length > 0 ? getTotalUsage() / historyData.length : 0;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <Text style={[styles.title, { fontSize: getScaledFontSize(36), color: colors.text }]}>{t.usage}</Text>

        <View style={[styles.rangeSelector, { backgroundColor: colors.surface }]}>
          {(["day", "week", "month"] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                selectedRange === range && { backgroundColor: colors.success, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
              ]}
              onPress={() => setSelectedRange(range)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  { fontSize: getScaledFontSize(22), color: selectedRange === range ? "#FFFFFF" : colors.textTertiary },
                ]}
              >
                {range === "day" ? t.today : range === "week" ? t.week : t.month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder }]}>
          <Text style={[styles.statLabel, { fontSize: getScaledFontSize(22), color: colors.info }]}>{t.total}</Text>
          <Text style={[styles.statValue, { fontSize: getScaledFontSize(64), color: colors.primary }]}>{getTotalUsage().toFixed(1)}</Text>
          <Text style={[styles.statUnit, { fontSize: getScaledFontSize(28), color: colors.info }]}>{t.kWh}</Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder }]}>
          <Text style={[styles.statLabel, { fontSize: getScaledFontSize(22), color: colors.info }]}>{t.averagePer} {selectedRange === "day" ? t.hour : t.day}</Text>
          <Text style={[styles.statValue, { fontSize: getScaledFontSize(64), color: colors.primary }]}>{getAverageUsage().toFixed(1)}</Text>
          <Text style={[styles.statUnit, { fontSize: getScaledFontSize(28), color: colors.info }]}>{t.kWh}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 8,
  },
  rangeSelector: {
    flexDirection: "row",
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
  rangeButtonText: {
    fontSize: 22,
    fontWeight: "700",
  },
  statsCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 3,
  },
  statLabel: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  statValue: {
    fontSize: 64,
    fontWeight: "900",
    marginBottom: 8,
  },
  statUnit: {
    fontSize: 28,
    fontWeight: "700",
  },
});