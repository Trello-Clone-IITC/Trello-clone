import { Router } from "express";
import listController from "./list.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  BoardIdParamSchema,
  CreateListInputSchema,
  // ListDtoSchema,
  ListIdParamSchema,
  UpdateListSchema,
} from "@ronmordo/contracts";

const router = Router();

// List CRUD operations
router.post(
  "/board/:boardId",
  validateRequest({ params: BoardIdParamSchema, body: CreateListInputSchema }),
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
router.get(
  "/:listId/watchers",
  validateRequest({ params: ListIdParamSchema }),
  listController.getListWatchers
);

router.get(
  "/:listId/cards",
  validateRequest({ params: ListIdParamSchema }),
  listController.getCardsByList
);

export default router;
