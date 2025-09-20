import { Router } from "express";
import listController from "./list.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import { CreateListInputSchema, ListIdParamSchema, UpdateListSchema, } from "@ronmordo/contracts";
import watchersRouter from "../list-watchers/list-watchers.route.js";
import cardsRouter from "../cards/card.route.js";
import boardController from "../boards/board.controller.js";
const router = Router({ mergeParams: true });
// List CRUD operations
router.get("/", boardController.getBoardLists);
router.post("/", validateRequest({ body: CreateListInputSchema }), listController.createList);
router.get("/:listId", validateRequest({ params: ListIdParamSchema }), listController.getList);
router.patch("/:listId", validateRequest({ params: ListIdParamSchema, body: UpdateListSchema }), listController.updateList);
router.delete("/:listId", validateRequest({ params: ListIdParamSchema }), listController.deleteList);
// -------------------------nested routes-------------------------
router.use("/:listId/watchers", validateRequest({ params: ListIdParamSchema }), watchersRouter);
router.use("/:listId/cards", validateRequest({ params: ListIdParamSchema }), cardsRouter);
export default router;
