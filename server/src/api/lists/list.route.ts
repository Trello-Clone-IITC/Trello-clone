import { Router } from "express";
import listController from "./list.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  CreateListInputSchema,
  // ListDtoSchema,
  ListIdParamSchema,
  UpdateListSchema,
} from "@ronmordo/contracts";
import watchersRouter from "../list-watchers/list-watchers.route.js";
import cardsRouter from "../cards/card.route.js";
import boardController from "../boards/board.controller.js";

const router = Router({ mergeParams: true });

// List CRUD operations
router.get("/", boardController.getBoardLists);

router.post(
  "/",
  validateRequest({ body: CreateListInputSchema }),
  listController.createList
);
router.get(
  "/:listId",
  validateRequest({ params: ListIdParamSchema }),
  listController.getList
);
router.patch(
  "/:listId",
  validateRequest({ params: ListIdParamSchema, body: UpdateListSchema }),
  listController.updateList
);
router.delete(
  "/:listId",
  validateRequest({ params: ListIdParamSchema }),
  listController.deleteList
);

// List specific operations
// -------------------------REDUNDANT- We cover this in update route-------------------------
// router.patch(
//   "/:listId/position",
//   validateRequest({
//     params: ListIdParamSchema,
//     body: CreateListInputSchema.shape.position,
//   }),
//   listController.updateListPosition
// );
// router.patch(
//   "/:listId/archive",
//   validateRequest({
//     params: ListIdParamSchema,
//     body: ListDtoSchema.shape.isArchived,
//   }),
//   listController.archiveList
// );
// router.patch(
//   "/:listId/subscribe",
//   validateRequest({
//     params: ListIdParamSchema,
//     body: ListDtoSchema.shape.subscribed,
//   }),
//   listController.subscribeToList
// );

// -------------------------nested routes-------------------------

router.use(
  "/:listId/watchers",
  validateRequest({ params: ListIdParamSchema }),
  watchersRouter
);

router.use(
  "/:listId/cards",
  validateRequest({ params: ListIdParamSchema }),
  cardsRouter
);

export default router;
