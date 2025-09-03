import { Router } from "express";
import {
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "./board.controller.js";
import { validateId } from "../../middlewares/validation.js";

const router = Router();

router.post("/", createBoard);
router.get("/:id", validateId, getBoard);
router.put("/:id", validateId, updateBoard);
router.delete("/:id", validateId, deleteBoard);

export default router;
