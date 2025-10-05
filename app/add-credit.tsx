import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { X, DollarSign, CreditCard, Ticket } from "lucide-react-native";
import { useAppState } from "@/hooks/useAppState";
import * as Haptics from "expo-haptics";

export default function AddCreditModal() {
  const [amount, setAmount] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [activeTab, setActiveTab] = useState<"amount" | "voucher">("amount");
  const [isLoading, setIsLoading] = useState(false);
  const { addCredit } = useAppState();

  const quickAmounts = [10, 25, 50, 100];

  const handleAddCredit = async () => {
    if (activeTab === "amount") {
      const creditAmount = parseFloat(amount);
      if (!creditAmount || creditAmount <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid amount");
        return;
      }

      setIsLoading(true);
      try {
        await addCredit(creditAmount, "manual", `Manual top-up of $${creditAmount}`);
        
        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        Alert.alert(
          "Credit Added",
          `$${creditAmount.toFixed(2)} has been added to your account`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } catch (error) {
        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert("Error", "Failed to add credit. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!voucherCode.trim()) {
        Alert.alert("Invalid Voucher", "Please enter a voucher code");
        return;
      }

      setIsLoading(true);
      try {
        // Simulate voucher validation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock voucher values
        const voucherValue = Math.floor(Math.random() * 50) + 10; // $10-$60
        await addCredit(voucherValue, "voucher", `Voucher: ${voucherCode}`);
        
        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        Alert.alert(
          "Voucher Redeemed",
          `$${voucherValue.toFixed(2)} has been added to your account`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } catch (error) {
        if (Platform.OS !== "web") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert("Error", "Invalid voucher code or redemption failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Credit</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "amount" && styles.activeTab]}
            onPress={() => setActiveTab("amount")}
          >
            <DollarSign 
              color={activeTab === "amount" ? "#FFFFFF" : "#6B7280"} 
              size={20} 
            />
            <Text style={[styles.tabText, activeTab === "amount" && styles.activeTabText]}>
              Amount
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "voucher" && styles.activeTab]}
            onPress={() => setActiveTab("voucher")}
          >
            <Ticket 
              color={activeTab === "voucher" ? "#FFFFFF" : "#6B7280"} 
              size={20} 
            />
            <Text style={[styles.tabText, activeTab === "voucher" && styles.activeTabText]}>
              Voucher
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.formContainer}>
          {activeTab === "amount" ? (
            <>
              {/* Amount Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Amount</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    maxLength={6}
                  />
                </View>
              </View>

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmountsContainer}>
                <Text style={styles.quickAmountsLabel}>Quick amounts</Text>
                <View style={styles.quickAmountsGrid}>
                  {quickAmounts.map((quickAmount) => (
                    <TouchableOpacity
                      key={quickAmount}
                      style={[
                        styles.quickAmountButton,
                        amount === quickAmount.toString() && styles.selectedQuickAmount
                      ]}
                      onPress={() => setAmount(quickAmount.toString())}
                    >
                      <Text style={[
                        styles.quickAmountText,
                        amount === quickAmount.toString() && styles.selectedQuickAmountText
                      ]}>
                        ${quickAmount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Voucher Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Voucher Code</Text>
                <TextInput
                  style={styles.voucherInput}
                  value={voucherCode}
                  onChangeText={setVoucherCode}
                  placeholder="Enter voucher code"
                  autoCapitalize="characters"
                  maxLength={12}
                />
              </View>

              <View style={styles.voucherInfo}>
                <CreditCard color="#6B7280" size={20} />
                <Text style={styles.voucherInfoText}>
                  Enter the code from your prepaid voucher to add credit to your account
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Add Credit Button */}
        <TouchableOpacity
          style={[
            styles.addButton,
            (activeTab === "amount" && !amount) || 
            (activeTab === "voucher" && !voucherCode.trim()) || 
            isLoading ? styles.disabledButton : null
          ]}
          onPress={handleAddCredit}
          disabled={
            (activeTab === "amount" && !amount) || 
            (activeTab === "voucher" && !voucherCode.trim()) || 
            isLoading
          }
        >
          <Text style={styles.addButtonText}>
            {isLoading ? "Processing..." : 
             activeTab === "amount" ? "Add Credit" : "Redeem Voucher"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
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
  tabSelector: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#10B981",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  voucherInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: "#111827",
  },
  quickAmountsContainer: {
    marginBottom: 32,
  },
  quickAmountsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    alignItems: "center",
  },
  selectedQuickAmount: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  selectedQuickAmountText: {
    color: "#10B981",
  },
  voucherInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 16,
  },
  voucherInfoText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});