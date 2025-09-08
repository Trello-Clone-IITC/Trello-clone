import { prisma } from "../../lib/prismaClient.js";
import { type BoardMember, BoardRole } from "@prisma/client";

const addBoardMember = async (
  boardId: string,
  userId: string,
  role: BoardRole = "Member"
): Promise<BoardMember> => {
  const member = await prisma.boardMember.create({
    data: {
      boardId,
      userId,
      role,
    },
  });
  return member;
};

const removeBoardMember = async (boardId: string, userId: string): Promise<boolean> => {
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
  } catch {
    return false;
  }
};

const updateBoardMemberRole = async (
  boardId: string,
  userId: string,
  newRole: BoardRole
): Promise<BoardMember | null> => {
  try {
    const member = await prisma.boardMember.update({
      where: {
        boardId_userId: {
          boardId,
          userId,
        },
      },
      data: { role: newRole },
    });
    return member;
  } catch {
    return null;
  }
};

const getBoardMembers = async (boardId: string): Promise<BoardMember[]> => {
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