import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

export type SQLiteDatabase = SQLite.SQLiteDatabase | null;

export async function initDB(): Promise<SQLiteDatabase> {
  if (Platform.OS === 'web') {
    console.log('SQLite not supported on web, using AsyncStorage fallback');
    return null;
  }

  const db = await SQLite.openDatabaseAsync("app.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS credit_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      delta REAL NOT NULL,
      source TEXT CHECK (source IN ('manual', 'voucher', 'system')) NOT NULL,
      note TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK (type IN ('low_credit', 'predicted_runout', 'high_usage', 'connection_lost')) NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      severity TEXT CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
      read BOOLEAN NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bluetooth_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rssi INTEGER NOT NULL,
      connectable BOOLEAN NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS energy_consumption_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kwhWh INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL
    );
  `);

  return db;
}
