import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.js";
import workspaceController from "../workspaces/workspace.controller.js";
import {
  CreateWorkspaceMemberInputSchema,
  UpdateWorkspaceMemberSchema,
  UserIdParamSchema,
} from "@ronmordo/contracts";

const router = Router({ mergeParams: true });

router.get("/", workspaceController.getWorkspaceMembers);

router.post(
  "/",
  validateRequest({ body: CreateWorkspaceMemberInputSchema }),
  workspaceController.addWorkspaceMember
);

router.patch(
  "/:userId",
  validateRequest({
    params: UserIdParamSchema,
    body: UpdateWorkspaceMemberSchema,
  }),
  workspaceController.updateWorkspaceMemberRole
);

router.delete(
  "/:userId",
  validateRequest({
    params: UserIdParamSchema,
  }),
  workspaceController.removeWorkspaceMember
);

export default router;
