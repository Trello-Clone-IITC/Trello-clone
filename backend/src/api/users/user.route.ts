import { Router } from "express";
import { usersController } from "./user.controller.js";
import { validateAuthenticatedUser } from "../auth/auth.middleware.js";
import activityLogsRouter from "../activity-logs/activity-log.route.js";

const router = Router();

// All routes for the users resource are protected since each op in trello is enabled if we are logged in.
// Authentication middleware.
router.use(validateAuthenticatedUser);

// Protected Routes
router.get("/me", usersController.getMe);

router.patch("/me", usersController.updateUser);

router.use("/me/activity", activityLogsRouter);

export default router;
