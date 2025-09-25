import { Router } from "express";
import { labelController } from "./label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateLabelInputSchema,
  LabelIdParamSchema,
  UpdateLabelSchema,
} from "@ronmordo/contracts";
import boardController from "../boards/board.controller.js";

const router = Router({ mergeParams: true });

// Label CRUD routes
router.get("/", boardController.getBoardLabels);

router.post(
  "/",
  validateRequest({ body: CreateLabelInputSchema }),
  labelController.createLabel
);

router.get(
  "/:labelId",
  validateRequest({ params: LabelIdParamSchema }),
  labelController.getLabel
);

router.patch(
  "/:labelId",
  validateRequest({
    params: LabelIdParamSchema,
    body: UpdateLabelSchema,
  }),
  labelController.updateLabel
);

router.delete(
  "/:labelId",
  validateRequest({ params: LabelIdParamSchema }),
  labelController.deleteLabel
);

export default router;
