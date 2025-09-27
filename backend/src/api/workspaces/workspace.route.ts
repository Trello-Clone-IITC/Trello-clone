import { Router } from "express";
import workspaceController from "./workspace.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import workspaceMemberRouter from "../workspace-members/workspace-members.route.js";
import boardRouter from "../boards/board.route.js";
import {
  CreateWorkspaceInputSchema,
  IdParamSchema,
  UpdateWorkspaceSchema,
} from "@ronmordo/contracts";
import { usersController } from "../users/user.controller.js";

const router = Router();

// Workspace CRUD operations

router.get("/", usersController.getAllWorkspaces);

router.post(
  "/",
  validateRequest({ body: CreateWorkspaceInputSchema }),
  workspaceController.createWorkspace
);
router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  workspaceController.getWorkspace
);
router.patch(
  "/:id",
  validateRequest({ params: IdParamSchema, body: UpdateWorkspaceSchema }),
  workspaceController.updateWorkspace
);
router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  workspaceController.deleteWorkspace
);

// --------------------------nested routes--------------------------

router.use(
  "/:id/members",
  validateRequest({ params: IdParamSchema }),
  workspaceMemberRouter
);

router.use(
  "/:id/boards",
  validateRequest({ params: IdParamSchema }),
  boardRouter
);

export default router;
