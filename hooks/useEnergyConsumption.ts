import { SQLiteDatabase } from "expo-sqlite";

interface EnergyRecord {
  id?: number;
  kwhWh: number;
  timestamp: number;
}

export async function addEnergyRecord(
  db: SQLiteDatabase,
  record: EnergyRecord
): Promise<number> {
  const { kwhWh, timestamp } = record;
  const result = await db.runAsync(
    `INSERT INTO energy_consumption_records (kwhWh, timestamp) VALUES (?, ?)`,
    [kwhWh, timestamp]
  );
  return result.lastInsertRowId!;
}

export async function getAllEnergyRecords(
  db: SQLiteDatabase
): Promise<EnergyRecord[]> {
  return await db.getAllAsync<EnergyRecord>(
    `SELECT * FROM energy_consumption_records ORDER BY timestamp DESC`
  );
}

export async function getEnergyRecordsByToday(
  db: SQLiteDatabase
): Promise<EnergyRecord[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const start = startOfDay.getTime();
  const end = start + 24 * 60 * 60 * 1000;

  return await db.getAllAsync<EnergyRecord>(
    `SELECT * FROM energy_consumption_records 
     WHERE timestamp BETWEEN ? AND ?
     ORDER BY timestamp DESC`,
    [start, end]
  );
}

export async function getEnergyRecordsByWeek(
  db: SQLiteDatabase
): Promise<EnergyRecord[]> {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  return await db.getAllAsync<EnergyRecord>(
    `SELECT * FROM energy_consumption_records 
     WHERE timestamp BETWEEN ? AND ?
     ORDER BY timestamp DESC`,
    [weekAgo, now]
  );
}

export async function getEnergyRecordsByMonth(
  db: SQLiteDatabase
): Promise<EnergyRecord[]> {
  const now = Date.now();
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  return await db.getAllAsync<EnergyRecord>(
    `SELECT * FROM energy_consumption_records 
     WHERE timestamp BETWEEN ? AND ?
     ORDER BY timestamp DESC`,
    [monthAgo, now]
  );
}

export async function getEnergyRecordById(
  db: SQLiteDatabase,
  id: number
): Promise<EnergyRecord | null> {
  return await db.getFirstAsync<EnergyRecord>(
    `SELECT * FROM energy_consumption_records WHERE id = ?`,
    [id]
  );
}

export async function editEnergyRecordById(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<EnergyRecord>
): Promise<void> {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = Object.values(fields);
  await db.runAsync(
    `UPDATE energy_consumption_records SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteEnergyRecordById(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(`DELETE FROM energy_consumption_records WHERE id = ?`, [
    id,
  ]);
}
