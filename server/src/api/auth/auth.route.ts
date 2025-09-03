import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

router.get("/me", authController.getMe);

export default router;
