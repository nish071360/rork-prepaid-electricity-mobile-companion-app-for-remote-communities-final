import { SQLiteDatabase } from "./useDatabase";

interface Alert {
  id?: number;
  type: "low_credit" | "predicted_runout" | "high_usage" | "connection_lost";
  title: string;
  message: string;
  timestamp: number;
  severity: "low" | "medium" | "high";
  read?: boolean;
}

export async function addAlert(
  db: SQLiteDatabase,
  alert: Alert
): Promise<number> {
  if (!db) {
    console.warn('Database not available on web');
    return 0;
  }

  const { type, title, message, timestamp, severity, read = false } = alert;
  const result = await db.runAsync(
    `INSERT INTO alerts (type, title, message, timestamp, severity, read) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, title, message, timestamp, severity, read ? 1 : 0]
  );
  return result.lastInsertRowId!;
}

export async function getAllAlerts(db: SQLiteDatabase): Promise<Alert[]> {
  if (!db) {
    console.warn('Database not available on web');
    return [];
  }

  return await db.getAllAsync<Alert>(
    `SELECT * FROM alerts ORDER BY timestamp DESC`
  );
}

export async function getAlertById(
  db: SQLiteDatabase,
  id: number
): Promise<Alert | null> {
  if (!db) {
    console.warn('Database not available on web');
    return null;
  }

  return await db.getFirstAsync<Alert>(`SELECT * FROM alerts WHERE id = ?`, [
    id,
  ]);
}

export async function editAlertById(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<Alert>
): Promise<void> {
  if (!db) {
    console.warn('Database not available on web');
    return;
  }

  const keys = Object.keys(fields);
  if (!keys.length) return;
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = Object.values(fields);
  await db.runAsync(`UPDATE alerts SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
}

export async function deleteAlertById(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  if (!db) {
    console.warn('Database not available on web');
    return;
  }

  await db.runAsync(`DELETE FROM alerts WHERE id = ?`, [id]);
}
