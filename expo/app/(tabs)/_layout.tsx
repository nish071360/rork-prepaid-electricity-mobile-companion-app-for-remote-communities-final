import { Tabs } from "expo-router";
import { Home, History, AlertTriangle, Settings } from "lucide-react-native";
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function TabLayout() {
  const { t } = useLanguage();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: "#6B7280",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "700",
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t.home,
          tabBarIcon: ({ color }) => <Home color={color} size={32} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t.history,
          tabBarIcon: ({ color }) => <History color={color} size={32} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t.alerts,
          tabBarIcon: ({ color }) => <AlertTriangle color={color} size={32} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.settings,
          tabBarIcon: ({ color }) => <Settings color={color} size={32} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}