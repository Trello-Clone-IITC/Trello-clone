import { Router } from "express";
import { labelController } from "./label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateLabelRequestSchema,
  UpdateLabelRequestSchema,
  GetLabelByIdRequestSchema,
  DeleteLabelRequestSchema,
} from "./label.validation.js";

const router = Router();

// Label CRUD routes
router.post(
  "/:id/labels",
  validateRequest(CreateLabelRequestSchema),
  labelController.createLabel
);

router.get(
  "/:id/labels/:labelId",
  validateRequest(GetLabelByIdRequestSchema),
  labelController.getLabel
);

router.patch(
  "/:id/labels/:labelId",
  validateRequest(UpdateLabelRequestSchema),
  labelController.updateLabel
);

router.delete(
  "/:id/labels/:labelId",
  validateRequest(DeleteLabelRequestSchema),
  labelController.deleteLabel
);

export default router;
