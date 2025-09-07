import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.js";
import workspaceController from "../workspaces/workspace.controller.js";
import {
  addWorkspaceMemberSchema,
  removeWorkspaceMemberSchema,
  updateWorkspaceMemberSchema,
} from "./workspace-members.validation.js";

const router = Router();

router.post(
  "/:id/members",
  validateRequest(addWorkspaceMemberSchema),
  workspaceController.addWorkspaceMember
);

router.delete(
  "/:id/members/:userId",
  validateRequest(removeWorkspaceMemberSchema),
  workspaceController.removeWorkspaceMember
);

router.patch(
  "/:id/members/:userId",
  validateRequest(updateWorkspaceMemberSchema),
  workspaceController.updateWorkspaceMemberRole
);

export default router;
