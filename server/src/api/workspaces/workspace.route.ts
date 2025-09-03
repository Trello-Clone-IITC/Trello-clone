import { Router } from "express";
import {
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceBoards,
} from "./workspace.controller.js";
import { validateId } from "../../middlewares/validation.js";

const router = Router();

router.post("/", createWorkspace);
router.get("/:id", validateId, getWorkspace);
router.put("/:id", validateId, updateWorkspace);
router.delete("/:id", validateId, deleteWorkspace);
router.get("/:id/boards", validateId, getWorkspaceBoards);

export default router;
