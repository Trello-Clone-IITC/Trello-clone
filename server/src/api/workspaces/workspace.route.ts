import { Router } from "express";
import {
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceBoards,
  getAllWorkspaces,
  getWorkspacesByUser,
  getWorkspacesByCreator,
  getWorkspaceMembers,
  addWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
  searchWorkspaces,
} from "./workspace.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
  addWorkspaceMemberSchema,
  updateWorkspaceMemberSchema,
  removeWorkspaceMemberSchema,
  getWorkspacesByUserSchema,
  searchWorkspacesSchema,
} from "./workspace.validation.js";

const router = Router();

// Workspace CRUD operations
router.post("/", validateRequest(createWorkspaceSchema), createWorkspace);
router.get("/", getAllWorkspaces);
router.get(
  "/search",
  validateRequest(searchWorkspacesSchema),
  searchWorkspaces
);
router.get(
  "/user/:userId",
  validateRequest(getWorkspacesByUserSchema),
  getWorkspacesByUser
);
router.get(
  "/creator/:userId",
  validateRequest(getWorkspacesByUserSchema),
  getWorkspacesByCreator
);
router.get("/:id", validateRequest(workspaceIdSchema), getWorkspace);
router.put("/:id", validateRequest(updateWorkspaceSchema), updateWorkspace);
router.delete("/:id", validateRequest(workspaceIdSchema), deleteWorkspace);

// Workspace boards
router.get(
  "/:id/boards",
  validateRequest(workspaceIdSchema),
  getWorkspaceBoards
);

// Workspace member management
router.get(
  "/:id/members",
  validateRequest(workspaceIdSchema),
  getWorkspaceMembers
);
router.post(
  "/:id/members",
  validateRequest(addWorkspaceMemberSchema),
  addWorkspaceMember
);
router.delete(
  "/:id/members/:userId",
  validateRequest(removeWorkspaceMemberSchema),
  removeWorkspaceMember
);
router.put(
  "/:id/members/:userId",
  validateRequest(updateWorkspaceMemberSchema),
  updateWorkspaceMemberRole
);

export default router;
