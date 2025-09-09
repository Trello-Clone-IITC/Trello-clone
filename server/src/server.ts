import { env } from "./config/env.js";
import express, { type Request, type Response } from "express";
import { AppError } from "./utils/appError.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import router from "./api/index.js";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prismaClient.js";
import { clerkMiddleware } from "@clerk/express";
import pino from "pino";
import * as pinoHttpNS from "pino-http";
import swaggerUi from "swagger-ui-express";
import { openApiDoc } from "./openapi.js";

// ENV variables
const { PORT, SESSION_SECRET } = env;

// Init express app
const app = express();

app.set("trust proxy", 1);

const pinoHttp = (pinoHttpNS as any).default ?? (pinoHttpNS as any);

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

// Global middlewares
app.use(express.json());
app.use(cookieParser(SESSION_SECRET));
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Request) {
        return {
          method: req.method,
          url: req.url,
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);
app.use(clerkMiddleware());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

// Health check endpoint
app.get("/health", (_req, res) => {
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

// Start listening
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
  console.log(`🚀 Server listening on PORT: ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: PostgreSQL`);
});

async function shutdown(reason: string, code = 0) {
  try {
    console.log(`\n↩️  Shutting down (${reason})...`);
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await prisma.$disconnect();
    console.log("✅ Clean shutdown complete.");
    process.exit(code);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
  shutdown("uncaughtException", 1);
});
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
  shutdown("unhandledRejection", 1);
});
