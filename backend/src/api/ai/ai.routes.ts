import { Router } from "express";
import { aiController } from "./ai.controller.js";
import { validateAuthenticatedUser } from "../auth/auth.middleware.js";

const router = Router();

// All AI routes require authentication
router.use(validateAuthenticatedUser);

// Chat with AI
router.post("/chat", aiController.chat);

// Get available functions
router.get("/functions", aiController.getAvailableFunctions);

export default router;
