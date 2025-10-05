import { SQLiteDatabase } from "expo-sqlite";

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
  const { type, title, message, timestamp, severity, read = false } = alert;
  const result = await db.runAsync(
    `INSERT INTO alerts (type, title, message, timestamp, severity, read) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, title, message, timestamp, severity, read ? 1 : 0]
  );
  return result.lastInsertRowId!;
}

export async function getAllAlerts(db: SQLiteDatabase): Promise<Alert[]> {
  return await db.getAllAsync<Alert>(
    `SELECT * FROM alerts ORDER BY timestamp DESC`
  );
}

export async function getAlertById(
  db: SQLiteDatabase,
  id: number
): Promise<Alert | null> {
  return await db.getFirstAsync<Alert>(`SELECT * FROM alerts WHERE id = ?`, [
    id,
  ]);
}

export async function editAlertById(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<Alert>
): Promise<void> {
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
  await db.runAsync(`DELETE FROM alerts WHERE id = ?`, [id]);
}
