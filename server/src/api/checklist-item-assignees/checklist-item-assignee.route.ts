import { Router } from "express";
import { checklistItemAssigneeController } from "./checklist-item-assignee.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as checklistItemAssigneeValidation from "./checklist-item-assignee.validation.js";

const router = Router();

// Checklist item assignee routes
router.post("/:cardId/checklists/:checklistId/items/:itemId/assignees", validateRequest(checklistItemAssigneeValidation.assignUserToItemSchema), checklistItemAssigneeController.assignUserToItem);
router.delete("/:cardId/checklists/:checklistId/items/:itemId/assignees/:userId", validateRequest(checklistItemAssigneeValidation.removeUserFromItemSchema), checklistItemAssigneeController.removeUserFromItem);

export default router;
