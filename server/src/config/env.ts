import "dotenv/config";

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key";
const NODE_ENV = process.env.NODE_ENV ?? "development";

if (!DATABASE_URL || !PORT || !SESSION_SECRET || !NODE_ENV) {
  throw new Error("Missing env variables");
}

export const env = {
  PORT,
  SESSION_SECRET,
  NODE_ENV,
};
