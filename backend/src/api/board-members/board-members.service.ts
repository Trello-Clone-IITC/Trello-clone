import { prisma } from "../../lib/prismaClient.js";
import type { BoardMemberWithUserDto, BoardRole } from "@ronmordo/contracts";
import {
  mapBoardMemberDtoToCreateInput,
  mapBoardMemberToDto,
  mapBoardRoleDto,
} from "./board-members.mapper.js";

const addBoardMember = async (
  boardId: string,
  userId: string,
  role: BoardRole = "member"
): Promise<BoardMemberWithUserDto> => {
  const member = await prisma.boardMember.create({
    data: {
      ...mapBoardMemberDtoToCreateInput({ userId, role }, boardId),
    },
    include: {
      user: true,
    },
  });
  const memberDto = mapBoardMemberToDto(member);

  return memberDto;
};

const removeBoardMember = async (
  boardId: string,
  userId: string
): Promise<boolean> => {
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
): Promise<BoardMemberWithUserDto> => {
  const member = await prisma.boardMember.update({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
    data: { role: mapBoardRoleDto(newRole) },
    include: {
      user: true,
    },
  });

  const memberDto = mapBoardMemberToDto(member);

  return memberDto;
};

const getBoardMembers = async (
  boardId: string
): Promise<BoardMemberWithUserDto[]> => {
  const members = await prisma.boardMember.findMany({
    where: { boardId },
    include: {
      user: true,
    },
    orderBy: { joinedAt: "asc" },
  });

  const membersDto = members.map(mapBoardMemberToDto);

  return membersDto;
};

export default {
  addBoardMember,
  removeBoardMember,
  updateBoardMemberRole,
  getBoardMembers,
};
