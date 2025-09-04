import { Router } from "express";
import {
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardsByWorkspace,
  getBoardsByUser,
  getAllBoards,
  addBoardMember,
  removeBoardMember,
  updateBoardMemberRole,
  getBoardMembers,
} from "./board.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema,
  addBoardMemberSchema,
  updateBoardMemberSchema,
  removeBoardMemberSchema,
} from "./board.validation.js";

const router = Router();

// Board CRUD operations
router.post("/", validateRequest(createBoardSchema), createBoard);
router.get("/", getAllBoards);
router.get("/workspace/:workspaceId", getBoardsByWorkspace);
router.get("/user/:userId", getBoardsByUser);
router.get("/:id", validateRequest(boardIdSchema), getBoard);
router.put("/:id", validateRequest(updateBoardSchema), updateBoard);
router.delete("/:id", validateRequest(boardIdSchema), deleteBoard);

// Board member management
router.get("/:id/members", validateRequest(boardIdSchema), getBoardMembers);
router.post(
  "/:id/members",
  validateRequest(addBoardMemberSchema),
  addBoardMember
);
router.put(
  "/:id/members/:userId",
  validateRequest(updateBoardMemberSchema),
  updateBoardMemberRole
);
router.delete(
  "/:id/members/:userId",
  validateRequest(removeBoardMemberSchema),
  removeBoardMember
);

export default router;
