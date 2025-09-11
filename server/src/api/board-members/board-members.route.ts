import { Router } from "express";
import boardMembersController from "./board-members.controller.js";
import { validateRequest } from "../../middlewares/validation.js";
// import {
//   addBoardMemberSchema,
//   updateBoardMemberSchema,
//   removeBoardMemberSchema,
// } from "./board-members.validation.js";
import {
  CreateBoardMemberInputSchema,
  UpdateBoardMemberSchema,
  UserIdParamSchema,
} from "@ronmordo/contracts";

const router = Router({ mergeParams: true });

// Board member management
router.post(
  "/",
  validateRequest({ body: CreateBoardMemberInputSchema }),
  boardMembersController.addBoardMember
);

router.patch(
  "/:userId",
  validateRequest({ params: UserIdParamSchema, body: UpdateBoardMemberSchema }),
  boardMembersController.updateBoardMemberRole
);

router.delete(
  "/:userId",
  validateRequest({ params: UserIdParamSchema }),
  boardMembersController.removeBoardMember
);

export default router;
