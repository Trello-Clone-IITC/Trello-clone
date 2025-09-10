import { Router } from "express";
import { cardLabelController } from "./card-label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  AddLabelToCardRequestSchema,
  RemoveLabelFromCardRequestSchema,
} from "./card-label.validation.js";

const router = Router();

// Card-label relationship routes
router.post(
  "/:cardId/labels",
  validateRequest(AddLabelToCardRequestSchema),
  cardLabelController.addLabelToCard
);

router.delete(
  "/:cardId/labels/:labelId",
  validateRequest(RemoveLabelFromCardRequestSchema),
  cardLabelController.removeLabelFromCard
);

export default router;
