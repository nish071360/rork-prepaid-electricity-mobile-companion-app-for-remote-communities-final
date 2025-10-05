import React, { useState } from "react";
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

type AlertType = "low_credit" | "predicted_runout" | "high_usage" | "connection_lost";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: number;
  severity: "low" | "medium" | "high";
  read: boolean;
}



export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { getScaledFontSize } = useTextSize();
  const { t } = useLanguage();
  
  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      type: "low_credit",
      title: t.lowCreditWarning,
      message: t.lowCreditWarningMessage,
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      severity: "medium",
      read: false,
    },
    {
      id: "2",
      type: "high_usage",
      title: t.highUsageDetected,
      message: t.highUsageDetectedMessage,
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
      severity: "low",
      read: true,
    },
    {
      id: "3",
      type: "predicted_runout",
      title: t.creditRunningLow,
      message: t.creditRunningLowMessage,
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      severity: "high",
      read: true,
    },
  ]);



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
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 24 }]}
      >
        <Text style={[styles.title, { fontSize: getScaledFontSize(36) }]}>{t.alerts}</Text>
        
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={[styles.unreadText, { fontSize: getScaledFontSize(20) }]}>{unreadCount} {t.newAlerts}</Text>
          </View>
        )}

        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { fontSize: getScaledFontSize(28) }]}>{t.noAlerts}</Text>
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
                  { borderColor: severityColor }
                ]}
              >
                <View style={styles.alertIconContainer}>
                  <Icon color={severityColor} size={48} strokeWidth={3} />
                </View>
                
                <Text style={[styles.alertTitle, { fontSize: getScaledFontSize(24) }]}>{alert.title}</Text>
                <Text style={[styles.alertMessage, { fontSize: getScaledFontSize(20) }]}>{alert.message}</Text>
                <Text style={[styles.alertTime, { fontSize: getScaledFontSize(18) }]}>{formatTimestamp(alert.timestamp)}</Text>
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
    marginBottom: 8,
  },
  unreadBadge: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#DC2626",
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
    color: "#9CA3AF",
  },
  alertCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 28,
    borderWidth: 4,
    borderColor: "#E5E7EB",
  },
  alertIconContainer: {
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 20,
    color: "#374151",
    lineHeight: 30,
    marginBottom: 16,
  },
  alertTime: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
});