import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, Bluetooth, Search, CheckCircle, Signal } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";

type SetupStep = "permissions" | "scanning" | "pairing" | "testing" | "complete";

interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  isConnectable: boolean;
}

const MOCK_DEVICES: BluetoothDevice[] = [
  { id: "1", name: "Energy Monitor #1", rssi: -45, isConnectable: true },
  { id: "2", name: "Energy Monitor #2", rssi: -67, isConnectable: true },
  { id: "3", name: "Smart Meter A1B2", rssi: -52, isConnectable: true },
  { id: "4", name: "Unknown Device", rssi: -89, isConnectable: false },
];

export default function SensorSetupModal() {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState<SetupStep>("permissions");
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { strength: t.excellent, color: "#10B981" };
    if (rssi > -60) return { strength: t.good, color: "#F59E0B" };
    if (rssi > -70) return { strength: t.fair, color: "#EF4444" };
    return { strength: t.poor, color: "#6B7280" };
  };

  const handleEnableBluetooth = async () => {
    // Simulate permission request
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep("scanning");
    startScanning();
  };

  const startScanning = async () => {
    setIsScanning(true);
    setDevices([]);
    
    // Simulate device discovery
    for (let i = 0; i < MOCK_DEVICES.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDevices(prev => [...prev, MOCK_DEVICES[i]]);
    }
    
    setIsScanning(false);
  };

  const handleDeviceSelect = async (device: BluetoothDevice) => {
    if (!device.isConnectable) {
      Alert.alert("Device Not Compatible", "This device is not a supported energy monitor.");
      return;
    }

    setSelectedDevice(device);
    setCurrentStep("pairing");
    setIsConnecting(true);

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setIsConnecting(false);
      setCurrentStep("testing");
      
      // Auto-start test
      setTimeout(() => {
        handleTestConnection();
      }, 1000);
      
    } catch (error) {
      setIsConnecting(false);
      Alert.alert("Connection Failed", "Could not connect to the selected device. Please try again.");
      setCurrentStep("scanning");
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      // Simulate test read
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setIsTesting(false);
      setCurrentStep("complete");
      
      // Auto-close after success
      setTimeout(() => {
        router.back();
      }, 3000);
      
    } catch (error) {
      setIsTesting(false);
      Alert.alert("Test Failed", "Could not read data from the sensor. Please check the connection.");
    }
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => {
    const signal = getSignalStrength(item.rssi);
    
    return (
      <TouchableOpacity
        style={[
          styles.deviceItem,
          !item.isConnectable && styles.disabledDevice
        ]}
        onPress={() => handleDeviceSelect(item)}
        disabled={!item.isConnectable}
      >
        <View style={styles.deviceInfo}>
          <Text style={[
            styles.deviceName,
            !item.isConnectable && styles.disabledText
          ]}>
            {item.name}
          </Text>
          <View style={styles.deviceMeta}>
            <Signal color={signal.color} size={16} />
            <Text style={[styles.signalText, { color: signal.color }]}>
              {signal.strength}
            </Text>
            <Text style={styles.rssiText}>({item.rssi} dBm)</Text>
          </View>
        </View>
        {item.isConnectable && (
          <Text style={styles.connectText}>{t.tapToConnect}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "permissions":
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepIcon}>
              <Bluetooth color="#10B981" size={48} />
            </View>
            <Text style={styles.stepTitle}>{t.enableBluetooth}</Text>
            <Text style={styles.stepDescription}>
              {t.weNeedBluetoothAccess}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleEnableBluetooth}
            >
              <Text style={styles.primaryButtonText}>{t.enableBluetooth}</Text>
            </TouchableOpacity>
          </View>
        );

      case "scanning":
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIcon}>
                <Search color="#10B981" size={48} />
              </View>
              <Text style={styles.stepTitle}>{t.scanningForDevices}</Text>
              <Text style={styles.stepDescription}>
                {t.makeSureYourEnergyMonitor}
              </Text>
            </View>

            {isScanning && (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.scanningText}>{t.searchingForDevices}</Text>
              </View>
            )}

            <FlatList
              data={devices}
              renderItem={renderDevice}
              keyExtractor={(item) => item.id}
              style={styles.deviceList}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={startScanning}
              disabled={isScanning}
            >
              <Text style={styles.secondaryButtonText}>
                {isScanning ? t.syncing : t.scanAgain}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case "pairing":
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepIcon}>
              {isConnecting ? (
                <ActivityIndicator size={48} color="#10B981" />
              ) : (
                <Bluetooth color="#10B981" size={48} />
              )}
            </View>
            <Text style={styles.stepTitle}>
              {isConnecting ? t.connecting : t.connected}
            </Text>
            <Text style={styles.stepDescription}>
              {isConnecting 
                ? `${t.establishingConnection} ${selectedDevice?.name}`
                : `${t.successfullyConnected} ${selectedDevice?.name}`
              }
            </Text>
            {selectedDevice && (
              <View style={styles.deviceDetails}>
                <Text style={styles.deviceDetailsText}>
                  {t.device}: {selectedDevice.name}
                </Text>
                <Text style={styles.deviceDetailsText}>
                  {t.signal}: {getSignalStrength(selectedDevice.rssi).strength}
                </Text>
              </View>
            )}
          </View>
        );

      case "testing":
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepIcon}>
              {isTesting ? (
                <ActivityIndicator size={48} color="#10B981" />
              ) : (
                <CheckCircle color="#10B981" size={48} />
              )}
            </View>
            <Text style={styles.stepTitle}>
              {isTesting ? t.testingConnection : t.testComplete}
            </Text>
            <Text style={styles.stepDescription}>
              {isTesting 
                ? t.readingDataFromMonitor
                : t.successfullyReceivedData
              }
            </Text>
            {!isTesting && (
              <View style={styles.testResults}>
                <Text style={styles.testResultText}>✓ {t.connectionEstablished}</Text>
                <Text style={styles.testResultText}>✓ {t.dataStreamActive}</Text>
                <Text style={styles.testResultText}>✓ {t.currentReading}</Text>
              </View>
            )}
          </View>
        );

      case "complete":
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepIcon}>
              <CheckCircle color="#10B981" size={48} />
            </View>
            <Text style={styles.stepTitle}>{t.setupComplete}</Text>
            <Text style={styles.stepDescription}>
              {t.yourEnergyMonitorIsConnected}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>{t.done}</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.surfaceBorder }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X color={colors.textTertiary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t.sensorSetup}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={[styles.progressContainer, { backgroundColor: colors.background, borderBottomColor: colors.surfaceBorder }]}>
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceBorder }]}>
          <View 
            style={[
              styles.progressFill,
              { backgroundColor: colors.success },
              { 
                width: `${
                  currentStep === "permissions" ? 20 :
                  currentStep === "scanning" ? 40 :
                  currentStep === "pairing" ? 60 :
                  currentStep === "testing" ? 80 : 100
                }%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textTertiary }]}>
          {t.step} {
            currentStep === "permissions" ? 1 :
            currentStep === "scanning" ? 2 :
            currentStep === "pairing" ? 3 :
            currentStep === "testing" ? 4 : 5
          } {t.of} 5
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderStepContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
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
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  stepHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  stepIcon: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  scanningIndicator: {
    alignItems: "center",
    marginBottom: 24,
  },
  scanningText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  deviceList: {
    flex: 1,
    width: "100%",
    marginBottom: 24,
  },
  deviceItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  disabledDevice: {
    opacity: 0.5,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  disabledText: {
    color: "#9CA3AF",
  },
  deviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  signalText: {
    fontSize: 12,
    fontWeight: "500",
  },
  rssiText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  connectText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  deviceDetails: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  deviceDetailsText: {
    fontSize: 14,
    color: "#065F46",
  },
  testResults: {
    backgroundColor: "#F0FDF4",
    padding: 20,
    borderRadius: 12,
    alignItems: "flex-start",
    gap: 8,
  },
  testResultText: {
    fontSize: 14,
    color: "#065F46",
  },
});