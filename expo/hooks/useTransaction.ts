import { CreditTransaction } from "./useAppState";
import { SQLiteDatabase } from "./useDatabase";

export async function addTransaction(
  db: SQLiteDatabase,
  delta: number,
  source: "manual" | "voucher" | "system",
  note?: string,
  date?: number
): Promise<number> {
  if (!db) {
    console.warn('Database not available on web');
    return 0;
  }

  const ts = date || Date.now();

  const result = await db.runAsync(
    "INSERT INTO credit_transactions (ts, delta, source, note) VALUES (?, ?, ?, ?);",
    [ts, delta, source, note ?? null]
  );

  return result.lastInsertRowId;
}

export async function getTransactions(
  db: SQLiteDatabase
): Promise<CreditTransaction[]> {
  if (!db) {
    console.warn('Database not available on web');
    return [];
  }

  const rows = await db.getAllAsync<CreditTransaction>(
    "SELECT * FROM credit_transactions ORDER BY ts DESC;"
  );
  return rows;
}

export async function getTransactionById(
  db: SQLiteDatabase,
  id: number
): Promise<CreditTransaction | null> {
  if (!db) {
    console.warn('Database not available on web');
    return null;
  }

  const row = await db.getFirstAsync<CreditTransaction>(
    "SELECT * FROM credit_transactions WHERE id = ?;",
    [id]
  );
  return row ?? null;
}

export async function updateTransaction(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<Pick<CreditTransaction, "delta" | "note">>
): Promise<void> {
  if (!db) {
    console.warn('Database not available on web');
    return;
  }

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

export async function deleteTransaction(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  if (!db) {
    console.warn('Database not available on web');
    return;
  }

  await db.runAsync("DELETE FROM credit_transactions WHERE id = ?;", [id]);
}

export async function getBalance(db: SQLiteDatabase): Promise<number> {
  if (!db) {
    console.warn('Database not available on web');
    return 0;
  }

  const row = await db.getFirstAsync<{ balance: number | null }>(
    "SELECT SUM(delta) as balance FROM credit_transactions;"
  );
  return row?.balance ? Number(row.balance) : 0;
}
