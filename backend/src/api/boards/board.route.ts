import { Router } from "express";
import boardController from "./board.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
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
