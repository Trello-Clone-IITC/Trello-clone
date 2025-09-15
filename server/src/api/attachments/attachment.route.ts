import { Router } from "express";
import { attachmentController } from "./attachment.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as attachmentValidation from "./attachment.validation.js";
import {
  CreateAttachmentInputSchema,
  IdParamSchema,
  UpdateAttachmentSchema,
} from "@ronmordo/contracts";
import { cardController } from "../cards/card.controller.js";

const router = Router({ mergeParams: true });

// Card-specific attachment routes
router.get("/", cardController.getCardAttachments);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  attachmentController.getAttachment
);

router.post(
  "/",
  validateRequest({ body: CreateAttachmentInputSchema }),
  attachmentController.createAttachment
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
