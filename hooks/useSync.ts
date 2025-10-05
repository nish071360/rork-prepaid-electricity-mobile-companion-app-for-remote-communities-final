import { SQLiteDatabase } from "expo-sqlite";

interface SyncHistory {
  id?: number;
  timestamp: number;
}

export async function addSyncHistory(
  db: SQLiteDatabase,
  record: SyncHistory
): Promise<number> {
  const { timestamp } = record;
  const result = await db.runAsync(
    `INSERT INTO sync_history (timestamp) VALUES (?)`,
    [timestamp]
  );
  return result.lastInsertRowId!;
}

export async function getAllSyncHistory(
  db: SQLiteDatabase
): Promise<SyncHistory[]> {
  return await db.getAllAsync<SyncHistory>(
    `SELECT * FROM sync_history ORDER BY timestamp DESC`
  );
}

export async function getSyncHistoryById(
  db: SQLiteDatabase,
  id: number
): Promise<SyncHistory | null> {
  return await db.getFirstAsync<SyncHistory>(
    `SELECT * FROM sync_history WHERE id = ?`,
    [id]
  );
}

export async function editSyncHistoryById(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<SyncHistory>
): Promise<void> {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = Object.values(fields);
  await db.runAsync(`UPDATE sync_history SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
}

export async function deleteSyncHistoryById(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(`DELETE FROM sync_history WHERE id = ?`, [id]);
}
