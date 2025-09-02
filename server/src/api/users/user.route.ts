import { Router } from "express";
import { getUser, updateUser, deleteUser } from "./user.controller.ts";
import { validateId } from "../../middlewares/validation.ts";

const router = Router();

router.get("/:id", validateId, getUser);
router.put("/:id", validateId, updateUser);
router.delete("/:id", validateId, deleteUser);

export default router;

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * User API routes with proper middleware integration:
 * - GET /:id - Retrieve user by ID (with ID validation)
 * - PUT /:id - Update user information (with ID validation)
 * - DELETE /:id - Remove user (with ID validation)
 *
 * All routes use the validateId middleware to ensure valid ID parameters
 * before reaching the controller functions. This provides consistent
 * error handling and data validation across all user endpoints.
 */
