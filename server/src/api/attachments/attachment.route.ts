import { Router } from "express";
import { attachmentController } from "./attachment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const createAttachmentSchema = z.object({
  body: z.object({
    cardId: z.string().uuid(),
    url: z.string().url(),
    filename: z.string().max(255).optional(),
    bytes: z.number().positive().optional(),
    meta: z.any().optional(),
  }),
});

const updateAttachmentSchema = z.object({
  body: z.object({
    filename: z.string().max(255).optional(),
    meta: z.any().optional(),
  }),
});

// Attachment CRUD routes
router.post(
  "/",
  validateRequest(createAttachmentSchema),
  attachmentController.createAttachment
);
router.get("/:id", attachmentController.getAttachment);
router.get("/card/:cardId", attachmentController.getCardAttachments);
router.put(
  "/:id",
  validateRequest(updateAttachmentSchema),
  attachmentController.updateAttachment
);
router.delete("/:id", attachmentController.deleteAttachment);

export default router;
