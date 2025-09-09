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
import {
  CreateWorkspaceRequestSchema,
  GetByIdRequestSchema,
  UpdateWorkspaceRequestSchema,
} from "@ronmordo/types";

const router = Router();

// Workspace CRUD operations
router.post(
  "/",
  validateRequest(CreateWorkspaceRequestSchema),
  workspaceController.createWorkspace
);
router.get(
  "/:id",
  validateRequest(GetByIdRequestSchema),
  workspaceController.getWorkspace
);
router.patch(
  "/:id",
  validateRequest(UpdateWorkspaceRequestSchema),
  // validateRequest(updateWorkspaceSchema),
  workspaceController.updateWorkspace
);
router.delete(
  "/:id",
  validateRequest(GetByIdRequestSchema),
  workspaceController.deleteWorkspace
);

// --------------------------nested routes--------------------------

// Workspace boards
router.get(
  "/:id/boards",
  validateRequest(GetByIdRequestSchema),
  workspaceController.getWorkspaceBoards
);

// Workspace member management
router.get(
  "/:id/members",
  validateRequest(GetByIdRequestSchema),
  workspaceController.getWorkspaceMembers
);

//extra routes

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
