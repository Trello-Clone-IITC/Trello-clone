import { Router } from "express";
import { checklistItemController } from "./checklist-item.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as checklistItemValidation from "./checklist-item.validation.js";

const router = Router();

// Checklist item CRUD routes
router.post("/:cardId/checklists/:checklistId/items", validateRequest(checklistItemValidation.createChecklistItemSchema), checklistItemController.createChecklistItem);
router.get("/:cardId/checklists/:checklistId/items/:id", validateRequest(checklistItemValidation.getChecklistItemSchema), checklistItemController.getChecklistItem);
router.patch("/:cardId/checklists/:checklistId/items/:id", validateRequest(checklistItemValidation.updateChecklistItemSchema), checklistItemController.updateChecklistItem);
router.delete("/:cardId/checklists/:checklistId/items/:id", validateRequest(checklistItemValidation.deleteChecklistItemSchema), checklistItemController.deleteChecklistItem);
router.patch("/:cardId/checklists/:checklistId/items/:id/toggle", validateRequest(checklistItemValidation.toggleChecklistItemSchema), checklistItemController.toggleChecklistItem);

// Get assignees for specific item
router.get("/:cardId/checklists/:checklistId/items/:id/assignees", validateRequest(checklistItemValidation.getChecklistItemAssigneesSchema), checklistItemController.getChecklistItemAssignees);

export default router;
