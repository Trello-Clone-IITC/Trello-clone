import "dotenv/config";

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key";
const NODE_ENV = process.env.NODE_ENV ?? "development";
const CLERK_JWT_KEY = process.env.CLERK_JWT_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (
  !DATABASE_URL ||
  !PORT ||
  !SESSION_SECRET ||
  !NODE_ENV ||
  !CLERK_JWT_KEY ||
  !OPENAI_API_KEY
) {
  throw new Error("Missing env variables");
}

export const env = {
  PORT,
  SESSION_SECRET,
  NODE_ENV,
  CLERK_JWT_KEY,
  OPENAI_API_KEY,
};
