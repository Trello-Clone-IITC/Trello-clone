import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.js";
import workspaceController from "../workspaces/workspace.controller.js";
// import {
//   addWorkspaceMemberSchema,
//   removeWorkspaceMemberSchema,
//   updateWorkspaceMemberSchema,
// } from "./workspace-members.validation.js";
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

router.delete(
  "/:userId",
  validateRequest({
    params: UserIdParamSchema,
  }),
  workspaceController.removeWorkspaceMember
);

router.patch(
  "/:userId",
  validateRequest({
    params: UserIdParamSchema,
    body: UpdateWorkspaceMemberSchema,
  }),
  workspaceController.updateWorkspaceMemberRole
);

export default router;
