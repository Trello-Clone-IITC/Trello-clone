import { Router } from "express";
import { cardLabelController } from "./card-label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import {
//   AddLabelToCardRequestSchema,
//   RemoveLabelFromCardRequestSchema,
// } from "./card-label.validation.js";
import { CreateCardLabelInputSchema, IdParamSchema } from "@ronmordo/contracts";

const router = Router();

// Card-label relationship routes
router.post(
  "/",
  validateRequest({ body: CreateCardLabelInputSchema }),
  cardLabelController.addLabelToCard
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  cardLabelController.removeLabelFromCard
);

export default router;
