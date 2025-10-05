import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertTriangle, DollarSign, Zap, Bell } from "lucide-react-native";

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
  
  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      type: "low_credit",
      title: "Low Credit Warning",
      message: "Your credit balance is below $10. Consider topping up soon.",
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      severity: "medium",
      read: false,
    },
    {
      id: "2",
      type: "high_usage",
      title: "High Usage Detected",
      message: "Today's usage is 25% above your average. Check for any unusual appliance activity.",
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
      severity: "low",
      read: true,
    },
    {
      id: "3",
      type: "predicted_runout",
      title: "Credit Running Low",
      message: "At current usage rate, your credit will run out in 2 days.",
      timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
      severity: "high",
      read: true,
    },
  ]);



  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Now";
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
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
        <Text style={styles.title}>Alerts</Text>
        
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} New</Text>
          </View>
        )}

        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No alerts</Text>
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
                
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{formatTimestamp(alert.timestamp)}</Text>
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