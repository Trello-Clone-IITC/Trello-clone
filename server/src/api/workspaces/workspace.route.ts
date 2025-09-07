import { Router } from "express";
import workspaceController from "./workspace.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
  getWorkspacesByUserSchema,
  searchWorkspacesSchema,
} from "./workspace.validation.js";
import workspaceMembersRouter from "../workspace-members/workspace-members.route.js";

const router = Router();

// Workspace CRUD operations
router.post(
  "/",
  validateRequest(createWorkspaceSchema),
  workspaceController.createWorkspace
);
router.get(
  "/:id",
  validateRequest(workspaceIdSchema),
  workspaceController.getWorkspace
);
router.patch(
  "/:id",
  validateRequest(updateWorkspaceSchema),
  workspaceController.updateWorkspace
);
router.delete(
  "/:id",
  validateRequest(workspaceIdSchema),
  workspaceController.deleteWorkspace
);

// Workspace boards
router.get(
  "/:id/boards",
  validateRequest(workspaceIdSchema),
  workspaceController.getWorkspaceBoards
);

// Workspace member management
router.get(
  "/:id/members",
  validateRequest(workspaceIdSchema),
  workspaceController.getWorkspaceMembers
);

router.get("/", workspaceController.getAllWorkspaces);
router.get(
  "/search",
  validateRequest(searchWorkspacesSchema),
  workspaceController.searchWorkspaces
);
router.get(
  "/user/:userId",
  validateRequest(getWorkspacesByUserSchema),
  workspaceController.getWorkspacesByUser
);
router.get(
  "/creator/:userId",
  validateRequest(getWorkspacesByUserSchema),
  workspaceController.getWorkspacesByCreator
);

router.use("/", workspaceMembersRouter);
export default router;
