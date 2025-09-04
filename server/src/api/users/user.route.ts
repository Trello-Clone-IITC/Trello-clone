import { Router } from "express";
import { getUser, updateUser, deleteUser } from "./user.controller.js";
import { validateId } from "../../middlewares/validation.js";

const router = Router();

router.get("/:id", validateId, getUser);
router.put("/:id", validateId, updateUser);
router.delete("/:id", validateId, deleteUser);

export default router;
