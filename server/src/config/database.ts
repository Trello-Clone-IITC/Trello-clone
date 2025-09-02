import { Pool } from "pg";

// Database connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Database query helper
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query: ${text} - Duration: ${duration}ms`);
    return res;
  } catch (error) {
    console.error(`Query error: ${text}`, error);
    throw error;
  }
};

// Database transaction helper
export const transaction = async (callback: (client: any) => Promise<any>) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL database connected successfully");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Error connecting to PostgreSQL database:", error);
    return false;
  }
};
