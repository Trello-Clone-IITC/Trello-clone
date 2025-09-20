import { AppError } from "../../utils/appError.js";
import boardMembersService from "./board-members.service.js";
import { mapBoardMemberToDto } from "./board-members.mapper.js";
import { userService } from "../users/user.service.js";
const addBoardMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId: memberUserId, role } = req.body;
        const userId = (await userService.getUserIdByRequest(req)) ||
            "3f992ec3-fd72-4153-8c8a-9575e5a61867";
        const member = await boardMembersService.addBoardMember(id, memberUserId, role);
        const memberDto = mapBoardMemberToDto(member);
        res.status(201).json({
            success: true,
            data: memberDto,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to add board member", 500));
    }
};
const removeBoardMember = async (req, res, next) => {
    try {
        const { id, userId: memberUserId } = req.params;
        const removed = await boardMembersService.removeBoardMember(id, memberUserId);
        if (!removed) {
            return next(new AppError("Board member not found", 404));
        }
        res.status(200).json({
            success: true,
            data: { message: "Board member removed successfully" },
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Failed to remove board member", 500));
    }
};
const updateBoardMemberRole = async (req, res, next) => {
    try {
        const { id, userId: memberUserId } = req.params;
        const { role } = req.body;
        const userId = await userService.getUserIdByRequest(req);
        // if (memberUserId !== userId) { -----> The admin can update the roles of members in his board, we need to check that userId is the admin of the board
        //   return next(
        //     new AppError("User not authorized to update this board member", 403)
        //   );
        // }
        const member = await boardMembersService.updateBoardMemberRole(id, memberUserId, role);
        if (!member) {
            return next(new AppError("Board member not found", 404));
        }
        const memberDto = mapBoardMemberToDto(member);
        res.status(200).json({
            success: true,
            data: memberDto,
        });
    }
    catch (error) {
        next(new AppError("Failed to update board member role", 500));
    }
};
export default {
    addBoardMember,
    removeBoardMember,
    updateBoardMemberRole,
};
