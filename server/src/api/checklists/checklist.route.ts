import { Router } from "express";
import { checklistController } from "./checklist.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const createChecklistSchema = z.object({
  body: z.object({
    cardId: z.string().uuid(),
    title: z.string().min(1).max(255),
    position: z.number().min(0).optional(),
  }),
});

const updateChecklistSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    position: z.number().min(0).optional(),
  }),
});

const createChecklistItemSchema = z.object({
  body: z.object({
    checklistId: z.string().uuid(),
    text: z.string().min(1).max(500),
    dueDate: z.string().datetime().optional(),
    position: z.number().min(0).optional(),
  }),
});

const updateChecklistItemSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(500).optional(),
    isCompleted: z.boolean().optional(),
    dueDate: z.string().datetime().optional(),
    position: z.number().min(0).optional(),
  }),
});

const assignUserSchema = z.object({
  body: z.object({
    itemId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

// Checklist CRUD routes
router.post(
  "/",
  validateRequest(createChecklistSchema),
  checklistController.createChecklist
);
router.get("/:id", checklistController.getChecklist);
router.put(
  "/:id",
  validateRequest(updateChecklistSchema),
  checklistController.updateChecklist
);
router.delete("/:id", checklistController.deleteChecklist);

// Checklist item routes
router.post(
  "/items",
  validateRequest(createChecklistItemSchema),
  checklistController.createChecklistItem
);
router.put(
  "/items/:id",
  validateRequest(updateChecklistItemSchema),
  checklistController.updateChecklistItem
);
router.delete("/items/:id", checklistController.deleteChecklistItem);
router.patch("/items/:id/toggle", checklistController.toggleChecklistItem);

// Assignment routes
router.post(
  "/items/assign",
  validateRequest(assignUserSchema),
  checklistController.assignUserToItem
);
router.delete(
  "/items/:itemId/assign/:userId",
  checklistController.removeUserFromItem
);

export default router;
