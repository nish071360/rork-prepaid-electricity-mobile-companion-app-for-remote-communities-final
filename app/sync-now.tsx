import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react-native";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";

type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline";

export default function SyncNowModal() {
  const { t } = useLanguage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isOnline] = useState(Math.random() > 0.3);
  const { syncNow } = useAppState();

  useEffect(() => {
    if (!isOnline) {
      setSyncStatus("offline");
      setStatusMessage("No internet connection available");
    }
  }, [isOnline]);

  const handleSync = async () => {
    if (!isOnline) {
      setSyncStatus("offline");
      setStatusMessage("Sync queued for when connection is restored");
      return;
    }

    setSyncStatus("syncing");
    setStatusMessage("Connecting to server...");

    try {
      // Simulate sync steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatusMessage("Uploading local data...");
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatusMessage("Downloading updates...");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatusMessage("Finalizing sync...");
      
      await syncNow();
      
      setSyncStatus("success");
      setStatusMessage("Sync completed successfully");
      
      // Auto-close after success
      setTimeout(() => {
        router.back();
      }, 2000);
      
    } catch (error) {
      setSyncStatus("error");
      setStatusMessage("Sync failed. Please try again.");
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <ActivityIndicator size="large" color="#10B981" />;
      case "success":
        return <CheckCircle color="#10B981" size={48} />;
      case "error":
        return <AlertCircle color="#EF4444" size={48} />;
      case "offline":
        return <WifiOff color="#6B7280" size={48} />;
      default:
        return <RefreshCw color="#10B981" size={48} />;
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "offline":
        return "#6B7280";
      default:
        return "#111827";
    }
  };

  const canSync = isOnline && syncStatus !== "syncing";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X color="#6B7280" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.syncData}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <View style={styles.connectionIndicator}>
            {isOnline ? (
              <Wifi color="#10B981" size={20} />
            ) : (
              <WifiOff color="#EF4444" size={20} />
            )}
          </View>
          <Text style={[styles.connectionText, { color: isOnline ? "#10B981" : "#EF4444" }]}>
            {isOnline ? t.connected : t.offline}
          </Text>
        </View>

        {/* Sync Status */}
        <View style={styles.syncStatusContainer}>
          <View style={styles.statusIcon}>
            {getStatusIcon()}
          </View>
          
          <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
            {syncStatus === "idle" && t.readyToSync}
            {syncStatus === "syncing" && t.syncing}
            {syncStatus === "success" && t.syncComplete}
            {syncStatus === "error" && t.syncFailed}
            {syncStatus === "offline" && t.offline}
          </Text>
          
          {statusMessage && (
            <Text style={styles.statusMessage}>{statusMessage}</Text>
          )}
        </View>

        {/* Sync Info */}
        <View style={styles.syncInfo}>
          <Text style={styles.syncInfoTitle}>{t.whatGetsSynced}</Text>
          <View style={styles.syncInfoList}>
            <Text style={styles.syncInfoItem}>• {t.energyUsageData}</Text>
            <Text style={styles.syncInfoItem}>• {t.creditTransactions}</Text>
            <Text style={styles.syncInfoItem}>• {t.alertPreferences}</Text>
            <Text style={styles.syncInfoItem}>• {t.deviceSettings}</Text>
          </View>
        </View>

        {/* Sync Button */}
        {syncStatus !== "success" && (
          <TouchableOpacity
            style={[
              styles.syncButton,
              !canSync && styles.disabledButton
            ]}
            onPress={handleSync}
            disabled={!canSync}
          >
            <Text style={[
              styles.syncButtonText,
              !canSync && styles.disabledButtonText
            ]}>
              {syncStatus === "syncing" ? t.syncing : 
               syncStatus === "offline" ? t.queueForSync : t.startSync}
            </Text>
          </TouchableOpacity>
        )}

        {/* Last Sync Info */}
        <View style={styles.lastSyncInfo}>
          <Text style={styles.lastSyncText}>
            {t.lastSuccessfulSync}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 40,
    gap: 8,
  },
  connectionIndicator: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  connectionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  syncStatusContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  statusMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  syncInfo: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  syncInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  syncInfoList: {
    gap: 8,
  },
  syncInfoItem: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  syncButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#FFFFFF",
  },
  lastSyncInfo: {
    alignItems: "center",
  },
  lastSyncText: {
    fontSize: 14,
    color: "#6B7280",
  },
});