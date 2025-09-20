import { prisma } from "../../lib/prismaClient.js";
import { mapBoardMemberDtoToCreateInput, mapBoardRoleDto, } from "./board-members.mapper.js";
const addBoardMember = async (boardId, userId, role = "member") => {
    const member = await prisma.boardMember.create({
        data: {
            ...mapBoardMemberDtoToCreateInput({ userId, role }, boardId),
        },
    });
    return member;
};
const removeBoardMember = async (boardId, userId) => {
    try {
        await prisma.boardMember.delete({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
        });
        return true;
    }
    catch {
        return false;
    }
};
const updateBoardMemberRole = async (boardId, userId, newRole) => {
    try {
        const member = await prisma.boardMember.update({
            where: {
                boardId_userId: {
                    boardId,
                    userId,
                },
            },
            data: { role: mapBoardRoleDto(newRole) },
        });
        return member;
    }
    catch {
        return null;
    }
};
const getBoardMembers = async (boardId) => {
    const members = await prisma.boardMember.findMany({
        where: { boardId },
        include: {
            user: true,
        },
        orderBy: { joinedAt: "asc" },
    });
    return members;
};
export default {
    addBoardMember,
    removeBoardMember,
    updateBoardMemberRole,
    getBoardMembers,
};
