import { Router } from "express";
import boardMembersController from "./board-members.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
import {
  addBoardMemberSchema,
  updateBoardMemberSchema,
  removeBoardMemberSchema,
} from "./board-members.validation.js";

const router = Router();

// Board member management
router.post(
  "/:id/members",
  validateRequest(addBoardMemberSchema),
  boardMembersController.addBoardMember
);

router.patch(
  "/:id/members/:userId",
  validateRequest(updateBoardMemberSchema),
  boardMembersController.updateBoardMemberRole
);

router.delete(
  "/:id/members/:userId",
  validateRequest(removeBoardMemberSchema),
  boardMembersController.removeBoardMember
);

export default router;
