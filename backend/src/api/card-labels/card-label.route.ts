import { Router } from "express";
import { cardLabelController } from "./card-label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateCardLabelInputSchema,
  LabelIdParamSchema,
} from "@ronmordo/contracts";
import { cardController } from "../cards/card.controller.js";

const router = Router({ mergeParams: true });

router.get("/", cardController.getCardLabels);

router.post(
  "/",
  validateRequest({ body: CreateCardLabelInputSchema }),
  cardLabelController.addLabelToCard
);

router.delete(
  "/:labelId",
  validateRequest({ params: LabelIdParamSchema }),
  cardLabelController.removeLabelFromCard
);

export default router;
