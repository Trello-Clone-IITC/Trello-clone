import { Router } from "express";
import { checklistController } from "./checklist.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import * as checklistValidation from "./checklist.validation.js";

const router = Router();

// Checklist CRUD routes
router.post("/:cardId/checklists", validateRequest(checklistValidation.createChecklistSchema), checklistController.createChecklist);
router.get("/:cardId/checklists/:id", validateRequest(checklistValidation.getChecklistSchema), checklistController.getChecklist);
router.patch(
  "/:cardId/checklists/:id",
  validateRequest(checklistValidation.updateChecklistSchema),
  checklistController.updateChecklist
);
router.delete("/:cardId/checklists/:id", validateRequest(checklistValidation.deleteChecklistSchema), checklistController.deleteChecklist);

//-------------------nested routes-------------------
// Get checklist items
router.get("/:cardId/checklists/:id/items", validateRequest(checklistValidation.getChecklistItemsSchema), checklistController.getChecklistItems);

export default router;