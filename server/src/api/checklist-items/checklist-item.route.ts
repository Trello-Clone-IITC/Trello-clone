import { Router } from "express";
import { checklistItemController } from "./checklist-item.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as checklistItemValidation from "./checklist-item.validation.js";
import { IdParamSchema, UpdateChecklistItemSchema } from "@ronmordo/contracts";

const router = Router();

// Checklist item CRUD routes
// router.post(
//   "/:cardId/checklists/:checklistId/items",
//   validateRequest(checklistItemValidation.createChecklistItemSchema),
//   checklistItemController.createChecklistItem
// );
router.post("/", checklistItemController.createChecklistItem);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  checklistItemController.getChecklistItem
);

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

// router.patch(
//   "/:cardId/checklists/:checklistId/items/:id/toggle",
//   validateRequest(checklistItemValidation.toggleChecklistItemSchema),
//   checklistItemController.toggleChecklistItem
// );

// Get assignees for specific item
router.get(
  "/:id/assignees",
  validateRequest({ params: IdParamSchema }),
  checklistItemController.getChecklistItemAssignees
);

export default router;
