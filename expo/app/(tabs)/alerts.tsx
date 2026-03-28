import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertTriangle, DollarSign, Zap, Bell } from "lucide-react-native";
import { useTextSize } from "@/hooks/useTextSize";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

type AlertType = "low_credit" | "predicted_runout" | "high_usage" | "connection_lost";

interface AlertData {
  id: string;
  type: AlertType;
  timestamp: number;
  severity: "low" | "medium" | "high";
  read: boolean;
}

interface Alert extends AlertData {
  title: string;
  message: string;
}

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { getScaledFontSize } = useTextSize();
  const { t } = useLanguage();
  const { colors } = useTheme();
  
  const [alertsData] = useState<AlertData[]>([
    {
      id: "1",
      type: "low_credit",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      severity: "medium",
      read: false,
    },
    {
      id: "2",
      type: "high_usage",
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      severity: "low",
      read: true,
    },
    {
      id: "3",
      type: "predicted_runout",
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      severity: "high",
      read: true,
    },
  ]);

  const alerts = useMemo<Alert[]>(() => {
    return alertsData.map(alert => {
      let title = "";
      let message = "";
      
      switch (alert.type) {
        case "low_credit":
          title = t.lowCreditWarning;
          message = t.lowCreditWarningMessage;
          break;
        case "high_usage":
          title = t.highUsageDetected;
          message = t.highUsageDetectedMessage;
          break;
        case "predicted_runout":
          title = t.creditRunningLow;
          message = t.creditRunningLowMessage;
          break;
        case "connection_lost":
          title = "Connection Lost";
          message = "Connection to device was lost.";
          break;
      }
      
      return {
        ...alert,
        title,
        message,
      };
    });
  }, [alertsData, t]);



  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return t.now;
    if (hours < 24) return `${hours} ${t.hoursAgo}`;
    if (days === 1) return t.yesterday;
    return `${days} ${t.daysAgo}`;
  };

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high": return "#EF4444";
      case "medium": return "#F59E0B";
      case "low": return "#10B981";
    }
  };

  const getSeverityIcon = (type: AlertType) => {
    switch (type) {
      case "low_credit": return DollarSign;
      case "predicted_runout": return AlertTriangle;
      case "high_usage": return Zap;
      case "connection_lost": return Bell;
    }
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <Text style={[styles.title, { fontSize: getScaledFontSize(36), color: colors.text }]}>{t.alerts}</Text>
        
        {unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.error }]}>
            <Text style={[styles.unreadText, { fontSize: getScaledFontSize(20) }]}>{unreadCount} {t.newAlerts}</Text>
          </View>
        )}

        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { fontSize: getScaledFontSize(28), color: colors.textTertiary }]}>{t.noAlerts}</Text>
          </View>
        ) : (
          alerts.map((alert) => {
            const Icon = getSeverityIcon(alert.type);
            const severityColor = getSeverityColor(alert.severity);
            
            return (
              <View 
                key={alert.id} 
                style={[
                  styles.alertCard,
                  { backgroundColor: colors.surface, borderColor: severityColor }
                ]}
              >
                <View style={styles.alertIconContainer}>
                  <Icon color={severityColor} size={48} strokeWidth={3} />
                </View>
                
                <Text style={[styles.alertTitle, { fontSize: getScaledFontSize(24), color: colors.text }]}>{alert.title}</Text>
                <Text style={[styles.alertMessage, { fontSize: getScaledFontSize(20), color: colors.textSecondary }]}>{alert.message}</Text>
                <Text style={[styles.alertTime, { fontSize: getScaledFontSize(18), color: colors.textTertiary }]}>{formatTimestamp(alert.timestamp)}</Text>
              </View>
            );
          })
        )}
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
    gap: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 8,
  },
  unreadBadge: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  unreadText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 28,
    fontWeight: "700",
  },
  alertCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 4,
  },
  alertIconContainer: {
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 16,
  },
  alertTime: {
    fontSize: 18,
    fontWeight: "600",
  },
});