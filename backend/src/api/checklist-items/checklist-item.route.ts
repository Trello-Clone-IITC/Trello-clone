import { Router } from "express";
import { checklistItemController } from "./checklist-item.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  ChecklistItemIdParamSchema,
  IdParamSchema,
  UpdateChecklistItemSchema,
} from "@ronmordo/contracts";
import { checklistController } from "../checklists/checklist.controller.js";
import checklistItemAssigneesRouter from "../checklist-item-assignees/checklist-item-assignee.route.js";

const router = Router({ mergeParams: true });

// Checklist item CRUD routes
router.get("/", checklistController.getChecklistItems);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  checklistItemController.getChecklistItem
);

router.post("/", checklistItemController.createChecklistItem);

router.patch(
  "/:id",
  validateRequest({ params: IdParamSchema, body: UpdateChecklistItemSchema }),
  checklistItemController.updateChecklistItem
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  checklistItemController.deleteChecklistItem
);

router.use(
  "/:itemId/checklistItemAssignees",
  validateRequest({ params: ChecklistItemIdParamSchema }),
  checklistItemAssigneesRouter
);

export default router;
