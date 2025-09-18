import { Router } from "express";
import { checklistController } from "./checklist.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
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

router.use(
  "/:checklistId/checklistItems",
  validateRequest({ params: ChecklistIdParamSchema }),
  checklistItemsRouter
);

export default router;
