import { Router } from "express";
import { usersController } from "./user.controller.js";
import { validateAuthenticatedUser } from "../auth/auth.middleware.js";

const router = Router();

// All routes for the users resource are protected since each op in trello is enabled if we are logged in.
// Authentication middleware.
router.use(validateAuthenticatedUser);

// Routes
router.get("/me", usersController.getMe);
router.get("/:id" /*usersController.getUserById*/);

export default router;
