import { Router } from "express";
import { attachmentController } from "./attachment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as attachmentValidation from "./attachment.validation.js";

const router = Router();

// Card-specific attachment routes
router.post("/:cardId/attachments", validateRequest(attachmentValidation.createAttachmentSchema), attachmentController.createAttachment);
router.get("/:cardId/attachments/:id", validateRequest(attachmentValidation.getAttachmentSchema), attachmentController.getAttachment);
router.patch(
  "/:cardId/attachments/:id",
  validateRequest(attachmentValidation.updateAttachmentSchema),
  attachmentController.updateAttachment
);
router.delete("/:cardId/attachments/:id", validateRequest(attachmentValidation.deleteAttachmentSchema), attachmentController.deleteAttachment);

export default router;