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
import listRouter from "../lists/list.route.js";
import labelsRouter from "../labels/label.route.js";
import boardMembersRouter from "../board-members/board-members.route.js";

const router = Router({ mergeParams: true });

// Board CRUD operations

router.get("/", workspaceController.getWorkspaceBoards);

router.get(
  "/:id",
  validateRequest({ params: IdParamSchema }),
  boardController.getBoard
);

router.post(
  "/",
  validateRequest({ body: CreateBoardInputSchema }),
  boardController.createBoard
);

// router.get("/", boardController.getAllBoards); //for aiman dev only

// router.get("/user/:userId", boardController.getBoardsByUser); //here untill ron add it to user controller --> currently we dont need that endpoint

// Full board view with all nested data
router.get(
  "/:id/full",
  validateRequest({ params: IdParamSchema }),
  boardController.getFullBoard
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
// This routes moved to their respective modules for readability
// -----------------------------------------------------------------------

// Board member management
// router.get(
//   "/:id/members",
//   validateRequest({ params: IdParamSchema }),
//   boardController.getBoardMembers
// );

// // Board lists management
// router.get(
//   "/:id/lists",
//   validateRequest({ params: IdParamSchema }),
//   boardController.getBoardLists
// );

// // Board labels management
// router.get(
//   "/:id/labels",
//   validateRequest({ params: IdParamSchema }),
//   boardController.getBoardLabels
// );

// // Board activity logs management -----> move this to acivity-logs module when implamented
// router.get(
//   "/:id/activity-logs",
//   validateRequest({ params: IdParamSchema }),
//   boardController.getBoardActivityLogs
// );

router.use(
  "/:id/boardMembers",
  validateRequest({ params: IdParamSchema }),
  boardMembersRouter
);

router.use(
  "/:id/lists",
  validateRequest({ params: IdParamSchema }),
  listRouter
);

router.use(
  "/:id/labels",
  validateRequest({ params: IdParamSchema }),
  labelsRouter
);

export default router;
