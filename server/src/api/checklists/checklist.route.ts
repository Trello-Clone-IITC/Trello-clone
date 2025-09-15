import { Router } from "express";
import { checklistController } from "./checklist.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as checklistValidation from "./checklist.validation.js";
import {
  CardIdParamSchema,
  ChecklistIdParamSchema,
  CreateChecklistInputSchema,
  IdParamSchema,
  UpdateChecklistSchema,
} from "@ronmordo/contracts";
import { cardController } from "../cards/card.controller.js";
import checklistItemsRouter from "../checklist-items/checklist-item.route.js";

const router = Router({ mergeParams: true });

// Checklist CRUD routes
router.get("/", cardController.getCardChecklists);

router.post(
  "/",
  validateRequest({
    body: CreateChecklistInputSchema,
  }),
  checklistController.createChecklist
);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  checklistController.getChecklist
);

router.patch(
  "/:id",
  validateRequest({
    params: IdParamSchema,
    body: UpdateChecklistSchema,
  }),
  checklistController.updateChecklist
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  checklistController.deleteChecklist
);

//-------------------nested routes-------------------
// Get checklist items
// router.get(
//   "/:cardId/checklists/:id/items",
//   validateRequest({ params: CardIdParamSchema.extend(IdParamSchema.shape) }),
//   checklistController.getChecklistItems
// );

router.use(
  "/:checklistId/checklistItems",
  validateRequest({ params: ChecklistIdParamSchema }),
  checklistItemsRouter
);

export default router;
