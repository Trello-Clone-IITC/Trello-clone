import { Router } from "express";
import { labelController } from "./label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import {
//   CreateLabelRequestSchema,
//   UpdateLabelRequestSchema,
//   GetLabelByIdRequestSchema,
//   DeleteLabelRequestSchema,
// } from "./label.validation.js";
import {
  CreateLabelInputSchema,
  IdParamSchema,
  LabelIdParamSchema,
  UpdateLabelSchema,
} from "@ronmordo/contracts";

const router = Router();

// Label CRUD routes
router.post(
  "/:id/labels",
  validateRequest({ params: IdParamSchema, body: CreateLabelInputSchema }),
  labelController.createLabel
);

router.get(
  "/:id/labels/:labelId",
  validateRequest({ params: IdParamSchema.extend(LabelIdParamSchema.shape) }),
  labelController.getLabel
);

router.patch(
  "/:id/labels/:labelId",
  validateRequest({
    params: IdParamSchema.extend(LabelIdParamSchema.shape),
    body: UpdateLabelSchema,
  }),
  labelController.updateLabel
);

router.delete(
  "/:id/labels/:labelId",
  validateRequest({ params: IdParamSchema.extend(LabelIdParamSchema.shape) }),
  labelController.deleteLabel
);

export default router;
