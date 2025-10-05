import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, Activity, Bluetooth, Database, Settings } from "lucide-react-native";

interface BLEPacket {
  id: string;
  timestamp: number;
  rssi: number;
  data: {
    ts: number;
    wh: number;
  };
  raw: string;
}

type LogLevel = "debug" | "info" | "warn" | "error";

export default function DebugModal() {
  const [logLevel, setLogLevel] = useState<LogLevel>("info");
  const [mockBLEEnabled, setMockBLEEnabled] = useState(true);
  const [blePackets, setBlePackets] = useState<BLEPacket[]>([]);
  const [currentRSSI] = useState(-52);

  // Generate mock BLE packets
  useEffect(() => {
    const generatePacket = (): BLEPacket => ({
      id: Date.now().toString() + Math.random(),
      timestamp: Date.now(),
      rssi: -45 + Math.random() * -30, // -45 to -75 dBm
      data: {
        ts: Date.now(),
        wh: Math.floor(Math.random() * 500) + 100, // 100-600 Wh
      },
      raw: `{ts:${Date.now()},wh:${Math.floor(Math.random() * 500) + 100}}`,
    });

    // Add initial packets
    const initialPackets = Array.from({ length: 10 }, generatePacket);
    setBlePackets(initialPackets);

    // Simulate new packets every 15 seconds
    const interval = setInterval(() => {
      setBlePackets(prev => {
        const newPackets = [generatePacket(), ...prev.slice(0, 19)]; // Keep last 20
        return newPackets;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case "debug": return "#6B7280";
      case "info": return "#10B981";
      case "warn": return "#F59E0B";
      case "error": return "#EF4444";
    }
  };

  const debugSections = [
    {
      title: "App Information",
      icon: Settings,
      items: [
        { label: "Version", value: "1.0.0" },
        { label: "Build", value: "2024.01.15" },
        { label: "Platform", value: "React Native" },
        { label: "Expo SDK", value: "53.0.0" },
      ],
    },
    {
      title: "Connection Status",
      icon: Bluetooth,
      items: [
        { label: "BLE Status", value: mockBLEEnabled ? "Mock Mode" : "Live Mode" },
        { label: "Current RSSI", value: `${currentRSSI} dBm` },
        { label: "Last Packet", value: blePackets.length > 0 ? formatTimestamp(blePackets[0].timestamp) : "None" },
        { label: "Packets Received", value: blePackets.length.toString() },
      ],
    },
    {
      title: "Data Storage",
      icon: Database,
      items: [
        { label: "Records Count", value: "2,847" },
        { label: "Credit Transactions", value: "23" },
        { label: "Storage Used", value: "1.2 MB" },
        { label: "Last Sync", value: "2 hours ago" },
      ],
    },
  ];

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
        <Text style={styles.title}>Debug Information</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Debug Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Mock BLE Mode</Text>
              <Text style={styles.settingDescription}>
                Use simulated sensor data instead of real BLE connection
              </Text>
            </View>
            <Switch
              value={mockBLEEnabled}
              onValueChange={setMockBLEEnabled}
              trackColor={{ false: "#E5E7EB", true: "#10B981" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Log Level</Text>
              <Text style={styles.settingDescription}>
                Current level: {logLevel.toUpperCase()}
              </Text>
            </View>
            <View style={styles.logLevelButtons}>
              {(["debug", "info", "warn", "error"] as LogLevel[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.logLevelButton,
                    logLevel === level && styles.activeLogLevel,
                    { borderColor: getLogLevelColor(level) }
                  ]}
                  onPress={() => setLogLevel(level)}
                >
                  <Text style={[
                    styles.logLevelText,
                    logLevel === level && { color: getLogLevelColor(level) }
                  ]}>
                    {level.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* System Information */}
        {debugSections.map((section) => {
          const Icon = section.icon;
          return (
            <View key={section.title} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon color="#6B7280" size={20} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              <View style={styles.infoGrid}>
                {section.items.map((item, index) => (
                  <View key={index} style={styles.infoItem}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* BLE Packets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity color="#6B7280" size={20} />
            <Text style={styles.sectionTitle}>Recent BLE Packets</Text>
          </View>
          
          <View style={styles.packetsContainer}>
            {blePackets.slice(0, 10).map((packet) => (
              <View key={packet.id} style={styles.packetItem}>
                <View style={styles.packetHeader}>
                  <Text style={styles.packetTime}>
                    {formatTimestamp(packet.timestamp)}
                  </Text>
                  <Text style={styles.packetRssi}>
                    {packet.rssi.toFixed(0)} dBm
                  </Text>
                </View>
                <Text style={styles.packetData}>
                  Energy: {(packet.data.wh / 1000).toFixed(2)} kWh
                </Text>
                <Text style={styles.packetRaw}>
                  Raw: {packet.raw}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Export Debug Logs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Clear Local Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Force Sync</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  logLevelButtons: {
    flexDirection: "row",
    gap: 8,
  },
  logLevelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeLogLevel: {
    backgroundColor: "#F3F4F6",
  },
  logLevelText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  packetsContainer: {
    gap: 12,
  },
  packetItem: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  packetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  packetTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  packetRssi: {
    fontSize: 12,
    color: "#6B7280",
  },
  packetData: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 2,
  },
  packetRaw: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#6B7280",
  },
  actionButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
});