import dotenv from "dotenv";

// Read from .env FIRST, before any other imports
dotenv.config();

import express from "express";
import morgan from "morgan";
import { AppError } from "./src/utils/appError";
import { globalErrorHandler } from "./src/middlewares/errorHandler";
import router from "./src/api/index";
import cookieParser from "cookie-parser";
import { pool, testConnection } from "./src/config/database";

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key";

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required in environment variables");
  process.exit(1);
}

// Init express app
const app = express();

app.set("trust proxy", 1);

// Test database connection
testConnection();

// Global middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(SESSION_SECRET));
app.use(morgan("combined"));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: " Backend is running",
    timestamp: new Date().toISOString(),
    database: "PostgreSQL",
  });
});

// API endpoints
app.use("/api", router);

// 404 handler
app.use((req, _res, next) => {
  return next(new AppError(`Route ${req.originalUrl} not found.`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  pool.end();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  pool.end();
  process.exit(0);
});

// Start listening
app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
  console.log(`🚀 Server listening on PORT: ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: PostgreSQL`);
});
