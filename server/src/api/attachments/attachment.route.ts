import { Router } from "express";
import { attachmentController } from "./attachment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as attachmentValidation from "./attachment.validation.js";
import {
  CreateAttachmentInputSchema,
  IdParamSchema,
  UpdateAttachmentSchema,
} from "@ronmordo/contracts";

const router = Router({ mergeParams: true });

// Card-specific attachment routes
router.post(
  "/",
  validateRequest({ body: CreateAttachmentInputSchema }),
  attachmentController.createAttachment
);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  attachmentController.getAttachment
);

router.patch(
  "/:id",
  validateRequest({ params: IdParamSchema, body: UpdateAttachmentSchema }),
  attachmentController.updateAttachment
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  attachmentController.deleteAttachment
);

export default router;
