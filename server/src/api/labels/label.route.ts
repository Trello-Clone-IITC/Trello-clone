import { Router } from "express";
import { labelController } from "./label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateLabelRequestSchema,
  UpdateLabelRequestSchema,
  GetByIdRequestSchema,
  CreateCardLabelRequestSchema,
} from "@ronmordo/types";
import { z } from "zod";

const router = Router();

// Custom request schemas for specific routes

const removeLabelFromCardRequestSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    labelId: z.string().uuid("Invalid label ID"),
  }),
  query: z.object({}),
  body: z.object({}),
});

// Label CRUD routes
router.post(
  "/:id/labels",
  validateRequest(CreateLabelRequestSchema),
  labelController.createLabel
);

router.get(
  "/:id/labels/:labelId",
  validateRequest(GetByIdRequestSchema),
  labelController.getLabel
);

router.patch(
  "/:id/labels/:labelId",
  validateRequest(UpdateLabelRequestSchema),
  labelController.updateLabel
);

router.delete(
  "/:id/labels/:labelId",
  validateRequest(GetByIdRequestSchema),
  labelController.deleteLabel
);

// Label-card relationship routes
router.post(
  "/card-labels",
  validateRequest(CreateCardLabelRequestSchema),
  labelController.addLabelToCard
);

router.delete(
  "/card-labels/:cardId/:labelId",
  validateRequest(removeLabelFromCardRequestSchema),
  labelController.removeLabelFromCard
);

export default router;
