import { SQLiteDatabase } from "expo-sqlite";

interface BluetoothConnection {
  id?: number;
  name: string;
  rssi: number;
  connectable: boolean;
}

export async function addBluetoothConnection(
  db: SQLiteDatabase,
  conn: BluetoothConnection
): Promise<number> {
  const { name, rssi, connectable } = conn;
  const result = await db.runAsync(
    `INSERT INTO bluetooth_connections (name, rssi, connectable) VALUES (?, ?, ?)`,
    [name, rssi, connectable ? 1 : 0]
  );
  return result.lastInsertRowId!;
}

export async function getAllBluetoothConnections(
  db: SQLiteDatabase
): Promise<BluetoothConnection[]> {
  return await db.getAllAsync<BluetoothConnection>(
    `SELECT * FROM bluetooth_connections`
  );
}

export async function getBluetoothConnectionById(
  db: SQLiteDatabase,
  id: number
): Promise<BluetoothConnection | null> {
  return await db.getFirstAsync<BluetoothConnection>(
    `SELECT * FROM bluetooth_connections WHERE id = ?`,
    [id]
  );
}

export async function editBluetoothConnectionById(
  db: SQLiteDatabase,
  id: number,
  fields: Partial<BluetoothConnection>
): Promise<void> {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = Object.values(fields);
  await db.runAsync(
    `UPDATE bluetooth_connections SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

export async function deleteBluetoothConnectionById(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(`DELETE FROM bluetooth_connections WHERE id = ?`, [id]);
}
