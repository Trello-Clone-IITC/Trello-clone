import { Router } from "express";
import { checklistController } from "./checklist.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as checklistValidation from "./checklist.validation.js";
import {
  CardIdParamSchema,
  CreateChecklistInputSchema,
  IdParamSchema,
  UpdateChecklistSchema,
} from "@ronmordo/contracts";

const router = Router({ mergeParams: true });

// Checklist CRUD routes
router.post(
  "/:cardId/checklists",
  validateRequest({
    params: CardIdParamSchema,
    body: CreateChecklistInputSchema,
  }),
  checklistController.createChecklist
);

router.get(
  "/:cardId/checklists/:id",
  validateRequest({ params: CardIdParamSchema.extend(IdParamSchema.shape) }),
  checklistController.getChecklist
);

router.patch(
  "/:cardId/checklists/:id",
  validateRequest({
    params: CardIdParamSchema.extend(IdParamSchema.shape),
    body: UpdateChecklistSchema,
  }),
  checklistController.updateChecklist
);

router.delete(
  "/:cardId/checklists/:id",
  validateRequest({ params: CardIdParamSchema.extend(IdParamSchema.shape) }),
  checklistController.deleteChecklist
);

//-------------------nested routes-------------------
// Get checklist items
router.get(
  "/:cardId/checklists/:id/items",
  validateRequest({ params: CardIdParamSchema.extend(IdParamSchema.shape) }),
  checklistController.getChecklistItems
);

export default router;
