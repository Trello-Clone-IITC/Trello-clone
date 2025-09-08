import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validateAuthenticatedUser } from "./auth.middleware.js";

const router = Router();

router.get("/checkEmail", authController.checkEmail);

router.post(
  "/onboarding",
  validateAuthenticatedUser,
  authController.onBoarding
);

export default router;
