import * as SQLite from "expo-sqlite";
import { CreditTransaction } from "./useAppState";

export type SQLiteDatabase = SQLite.SQLiteDatabase;

// ✅ Open or create the database
export async function initDB(): Promise<SQLiteDatabase> {
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

  return db;
}

// ✅ Add transaction
export async function addTransaction(
  db: SQLiteDatabase,
  delta: number,
  source: "manual" | "voucher" | "system",
  note?: string,
  date?: number
): Promise<number> {
  const ts = date || Date.now();

  const result = await db.runAsync(
    "INSERT INTO credit_transactions (ts, delta, source, note) VALUES (?, ?, ?, ?);",
    [ts, delta, source, note ?? null]
  );

  return result.lastInsertRowId;
}

// ✅ Get all transactions
export async function getTransactions(
  db: SQLiteDatabase
): Promise<CreditTransaction[]> {
  const rows = await db.getAllAsync<CreditTransaction>(
    "SELECT * FROM credit_transactions ORDER BY ts DESC;"
  );
  return rows;
}

// ✅ Get single transaction by ID
export async function getTransactionById(
  db: SQLiteDatabase,
  id: number
): Promise<CreditTransaction | null> {
  const row = await db.getFirstAsync<CreditTransaction>(
    "SELECT * FROM credit_transactions WHERE id = ?;",
    [id]
  );
  return row ?? null;
}

// ✅ Update transaction
export async function updateTransaction(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<Pick<CreditTransaction, "delta" | "note">>
): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];

  if (fields.delta !== undefined) {
    updates.push("delta = ?");
    values.push(fields.delta);
  }

  if (fields.note !== undefined) {
    updates.push("note = ?");
    values.push(fields.note);
  }

  if (updates.length === 0) return;

  values.push(id);
  await db.runAsync(
    `UPDATE credit_transactions SET ${updates.join(", ")} WHERE id = ?;`,
    values
  );
}

// ✅ Delete transaction
export async function deleteTransaction(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM credit_transactions WHERE id = ?;", [id]);
}

// ✅ Get current balance
export async function getBalance(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ balance: number | null }>(
    "SELECT SUM(delta) as balance FROM credit_transactions;"
  );
  return row?.balance ? Number(row.balance) : 0;
}
