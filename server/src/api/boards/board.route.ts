import { Router } from "express";
import boardController from "./board.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import {
//   createBoardSchema,
//   updateBoardSchema,
//   boardIdSchema,
// } from "./board.validation.js";
import {
  CreateBoardInputSchema,
  IdParamSchema,
  UpdateBoardSchema,
} from "@ronmordo/contracts";
import workspaceController from "../workspaces/workspace.controller.js";

const router = Router({ mergeParams: true });

// Board CRUD operations

router.get("/", workspaceController.getWorkspaceBoards);

router.post(
  "/",
  validateRequest({ body: CreateBoardInputSchema }),
  boardController.createBoard
);

// router.get("/", boardController.getAllBoards); //for aiman dev only

router.get("/user/:userId", boardController.getBoardsByUser); //here untill ron add it to user controller

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  boardController.getBoard
);

router.patch(
  "/:id",
  validateRequest({ params: IdParamSchema, body: UpdateBoardSchema }),
  boardController.updateBoard
);

router.delete(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  boardController.deleteBoard
);

//---------------------------nested routes--------------------------------

// Board member management
router.get(
  "/:id/members",
  validateRequest({ params: IdParamSchema }),
  boardController.getBoardMembers
);

// Board lists management
router.get(
  "/:id/lists",
  validateRequest({ params: IdParamSchema }),
  boardController.getBoardLists
);

// Board labels management
router.get(
  "/:id/labels",
  validateRequest({ params: IdParamSchema }),
  boardController.getBoardLabels
);

// Board activity logs management
router.get(
  "/:id/activity-logs",
  validateRequest({ params: IdParamSchema }),
  boardController.getBoardActivityLogs
);

// Full board view with all nested data
router.get(
  "/:id/full",
  validateRequest({ params: IdParamSchema }),
  boardController.getFullBoard
);

export default router;
