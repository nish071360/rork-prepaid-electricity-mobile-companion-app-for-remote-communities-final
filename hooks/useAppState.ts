import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EnergyRecord {
  ts: number;
  kwh_wh: number;
}

interface CreditTransaction {
  id: string;
  ts: number;
  delta: number;
  source: "manual" | "voucher" | "system";
  note?: string;
}

interface AppState {
  creditRemaining: number;
  todayKwh: number;
  expectedTodayKwh: number;
  rateNow: number;
  lastSynced: number;
  bleConnected: boolean;
}

const MOCK_RECORDS: EnergyRecord[] = [
  // Generate 24 hours of 15-minute intervals (96 records)
  ...Array.from({ length: 96 }, (_, i) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timestamp = startOfDay.getTime() + (i * 15 * 60 * 1000);
    
    // Simulate realistic usage patterns
    const hour = Math.floor(i / 4);
    let baseUsage = 0.3; // Base load
    
    // Morning peak (6-9 AM)
    if (hour >= 6 && hour <= 9) baseUsage += 0.8;
    // Evening peak (5-10 PM)
    if (hour >= 17 && hour <= 22) baseUsage += 1.2;
    // Night low usage (11 PM - 5 AM)
    if (hour >= 23 || hour <= 5) baseUsage = 0.15;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    const usage = baseUsage * randomFactor;
    
    return {
      ts: timestamp,
      kwh_wh: usage * 1000, // Convert to watt-hours
    };
  }),
];

const MOCK_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "1",
    ts: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    delta: 50,
    source: "manual",
    note: "Top up via app",
  },
  {
    id: "2",
    ts: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    delta: 25,
    source: "voucher",
    note: "Voucher redemption",
  },
];

export function useAppState() {
  const [state, setState] = useState<AppState>({
    creditRemaining: 23.45,
    todayKwh: 0,
    expectedTodayKwh: 12.5,
    rateNow: 28.5, // cents per kWh
    lastSynced: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    bleConnected: Math.random() > 0.5, // Random connection state
  });

  // Calculate today's usage from mock records
  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Calculate how many 15-minute intervals have passed today
    const intervalsPassedToday = Math.floor((currentHour * 60 + currentMinute) / 15);
    
    const todayRecords = MOCK_RECORDS.slice(0, intervalsPassedToday);
    const todayUsage = todayRecords.reduce((sum, record) => sum + record.kwh_wh, 0) / 1000; // Convert to kWh
    
    setState(prev => ({
      ...prev,
      todayKwh: todayUsage,
    }));
  }, []);

  // Simulate BLE connection changes
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        bleConnected: Math.random() > 0.3, // 70% chance of being connected
      }));
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getHistoryData = (range: "day" | "week" | "month") => {
    switch (range) {
      case "day":
        // Return 24 hours of data (4 intervals per hour)
        return Array.from({ length: 24 }, (_, hour) => {
          const hourRecords = MOCK_RECORDS.slice(hour * 4, (hour + 1) * 4);
          return hourRecords.reduce((sum, record) => sum + record.kwh_wh, 0) / 1000;
        });
      
      case "week":
        // Return 7 days of data
        return Array.from({ length: 7 }, (_, day) => {
          // Simulate daily totals
          const baseDaily = 12 + Math.random() * 8; // 12-20 kWh per day
          const weekendMultiplier = (day === 0 || day === 6) ? 1.15 : 1; // 15% more on weekends
          return baseDaily * weekendMultiplier;
        });
      
      case "month":
        // Return 4 weeks of data
        return Array.from({ length: 4 }, (_, week) => {
          // Simulate weekly totals
          const baseWeekly = 85 + Math.random() * 30; // 85-115 kWh per week
          return baseWeekly;
        });
      
      default:
        return [];
    }
  };

  const addCredit = async (amount: number, source: "manual" | "voucher" = "manual", note?: string) => {
    const transaction: CreditTransaction = {
      id: Date.now().toString(),
      ts: Date.now(),
      delta: amount,
      source,
      note,
    };

    // Optimistic update
    setState(prev => ({
      ...prev,
      creditRemaining: prev.creditRemaining + amount,
    }));

    try {
      // Store transaction locally
      const existingTransactions = await AsyncStorage.getItem("credit_transactions");
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.push(transaction);
      await AsyncStorage.setItem("credit_transactions", JSON.stringify(transactions));
      
      // TODO: Sync with server when online
      console.log("Credit added successfully:", transaction);
    } catch (error) {
      // Rollback on error
      setState(prev => ({
        ...prev,
        creditRemaining: prev.creditRemaining - amount,
      }));
      throw error;
    }
  };

  const syncNow = async () => {
    try {
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setState(prev => ({
        ...prev,
        lastSynced: Date.now(),
      }));
      
      console.log("Sync completed successfully");
      return { success: true };
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    }
  };

  return {
    state,
    getHistoryData,
    addCredit,
    syncNow,
  };
}