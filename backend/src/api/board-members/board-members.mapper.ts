import { Prisma, type BoardMember, $Enums, type User } from "@prisma/client";
import {
  BoardMemberWithUserSchema,
  type BoardMemberDto,
  type BoardMemberWithUserDto,
  type CreateBoardMemberInput,
} from "@ronmordo/contracts";
import { mapUserToDto } from "../users/user.mapper.js";

export function mapBoardMemberToDto(
  member: BoardMember & { user: User }
): BoardMemberWithUserDto {
  const dto: BoardMemberWithUserDto = {
    boardId: member.boardId,
    userId: member.userId,
    role: mapBoardRole(member.role),
    joinedAt: member.joinedAt.toISOString(),
    user: mapUserToDto(member.user),
  };
  return BoardMemberWithUserSchema.parse(dto);
}

function mapBoardRole(r: $Enums.BoardRole): BoardMemberDto["role"] {
  return r.toLowerCase() as BoardMemberDto["role"];
}

export function mapBoardMemberDtoToCreateInput(
  dto: CreateBoardMemberInput,
  boardId: string
): Prisma.BoardMemberCreateInput {
  return {
    board: { connect: { id: boardId } },
    user: { connect: { id: dto.userId } },
    role: mapBoardRoleDto(dto.role),
  };
}

export function mapBoardRoleDto(v: BoardMemberDto["role"]): $Enums.BoardRole {
  switch (v) {
    case "admin":
      return "Admin";
    case "member":
      return "Member";
    case "observer":
      return "Observer";
  }
}
