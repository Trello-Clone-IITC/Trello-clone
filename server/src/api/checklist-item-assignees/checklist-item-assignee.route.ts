import { Router } from "express";
import { checklistItemAssigneeController } from "./checklist-item-assignee.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import * as checklistItemAssigneeValidation from "./checklist-item-assignee.validation.js";
import { UserIdParamSchema } from "@ronmordo/contracts";

const router = Router({ mergeParams: true });

// Checklist item assignee routes
router.post(
  "/",
  validateRequest({ body: UserIdParamSchema }),
  checklistItemAssigneeController.assignUserToItem
);
router.delete(
  "/:userId",
  validateRequest({ params: UserIdParamSchema }),
  checklistItemAssigneeController.removeUserFromItem
);

export default router;
