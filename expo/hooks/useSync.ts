import { SQLiteDatabase } from "./useDatabase";

interface SyncHistory {
  id?: number;
  timestamp: number;
}

export async function addSyncHistory(
  db: SQLiteDatabase,
  record: SyncHistory
): Promise<number> {
  if (!db) {
    console.warn('Database not available on web');
    return 0;
  }

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
  if (!db) {
    console.warn('Database not available on web');
    return [];
  }

  return await db.getAllAsync<SyncHistory>(
    `SELECT * FROM sync_history ORDER BY timestamp DESC`
  );
}

export async function getSyncHistoryById(
  db: SQLiteDatabase,
  id: number
): Promise<SyncHistory | null> {
  if (!db) {
    console.warn('Database not available on web');
    return null;
  }

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
  if (!db) {
    console.warn('Database not available on web');
    return;
  }

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
  if (!db) {
    console.warn('Database not available on web');
    return;
  }

  await db.runAsync(`DELETE FROM sync_history WHERE id = ?`, [id]);
}
