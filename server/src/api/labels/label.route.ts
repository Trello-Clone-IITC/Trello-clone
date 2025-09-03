import { Router } from "express";
import { labelController } from "./label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const createLabelSchema = z.object({
  body: z.object({
    boardId: z.string().uuid(),
    name: z.string().min(1).max(50),
    color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"),
  }),
});

const updateLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
      .optional(),
  }),
});

const addLabelToCardSchema = z.object({
  body: z.object({
    cardId: z.string().uuid(),
    labelId: z.string().uuid(),
  }),
});

// Label CRUD routes
router.post(
  "/",
  validateRequest(createLabelSchema),
  labelController.createLabel
);
router.get("/:id", labelController.getLabel);
router.get("/board/:boardId", labelController.getBoardLabels);
router.put(
  "/:id",
  validateRequest(updateLabelSchema),
  labelController.updateLabel
);
router.delete("/:id", labelController.deleteLabel);

// Label-card relationship routes
router.post(
  "/card",
  validateRequest(addLabelToCardSchema),
  labelController.addLabelToCard
);
router.delete("/card/:cardId/:labelId", labelController.removeLabelFromCard);

export default router;
