import { Router } from "express";
import { labelController } from "./label.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateLabelRequestSchema,
  UpdateLabelRequestSchema,
  GetByIdRequestSchema,
  CreateCardLabelRequestSchema,
  BoardIdParam,
  CardIdParam,
  LabelIdParam,
} from "@ronmordo/types";
import { z } from "zod";

const router = Router();

// Custom request schemas for specific routes
const getBoardLabelsRequestSchema = z.object({
  params: BoardIdParam,
  query: z.object({}),
  body: z.object({}),
});

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

router.get(
  "/:boardId/labels",
  validateRequest(getBoardLabelsRequestSchema),
  labelController.getBoardLabels
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
