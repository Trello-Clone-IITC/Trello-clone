import { Router } from "express";
import boardController from "./board.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema,
} from "./board.validation.js";

const router = Router();

// Board CRUD operations
router.post(
  "/",
  validateRequest(createBoardSchema),
  boardController.createBoard
);
router.get("/", boardController.getAllBoards);//for aiman dev only
router.get("/user/:userId", boardController.getBoardsByUser);//here untill ron add it to user controller
router.get("/:id", validateRequest(boardIdSchema), boardController.getBoard);
router.patch(
  "/:id",
  validateRequest(updateBoardSchema),
  boardController.updateBoard
);
router.delete(
  "/:id",
  validateRequest(boardIdSchema),
  boardController.deleteBoard
);

//---------------------------nested routes--------------------------------

// Board member management
router.get(
  "/:id/members",
  validateRequest(boardIdSchema),
  boardController.getBoardMembers
);

// Board lists management
router.get(
  "/:id/lists",
  validateRequest(boardIdSchema),
  boardController.getBoardLists
);

// Board labels management
router.get(
  "/:id/labels",
  validateRequest(boardIdSchema),
  boardController.getBoardLabels
);

// Board activity logs management
router.get(
  "/:id/activity-logs",
  validateRequest(boardIdSchema),
  boardController.getBoardActivityLogs
);




export default router;
