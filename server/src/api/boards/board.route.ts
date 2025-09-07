import { Router } from "express";
import boardController from "./board.controller.js";
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
router.post(
  "/",
  validateRequest(createBoardSchema),
  boardController.createBoard
);
router.get("/", boardController.getAllBoards);
router.get("/workspace/:workspaceId", boardController.getBoardsByWorkspace);
router.get("/user/:userId", boardController.getBoardsByUser);
router.get("/:id", validateRequest(boardIdSchema), boardController.getBoard);
router.put(
  "/:id",
  validateRequest(updateBoardSchema),
  boardController.updateBoard
);
router.delete(
  "/:id",
  validateRequest(boardIdSchema),
  boardController.deleteBoard
);

// Board member management
router.get(
  "/:id/members",
  validateRequest(boardIdSchema),
  boardController.getBoardMembers
);
router.post(
  "/:id/members",
  validateRequest(addBoardMemberSchema),
  boardController.addBoardMember
);
router.patch(
  "/:id/members/:userId",
  validateRequest(updateBoardMemberSchema),
  boardController.updateBoardMemberRole
);
router.delete(
  "/:id/members/:userId",
  validateRequest(removeBoardMemberSchema),
  boardController.removeBoardMember
);

export default router;
