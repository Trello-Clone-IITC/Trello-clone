import { Router } from "express";
import { attachmentController } from "./attachment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { createAttachmentSchema, updateAttachmentSchema } from "./attachment.validation.js";

const router = Router();

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
