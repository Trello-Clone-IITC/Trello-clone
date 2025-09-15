import { Prisma, type BoardMember, $Enums } from "@prisma/client";
import {
  BoardMemberDtoSchema,
  type BoardMemberDto,
  type CreateBoardMemberInput,
} from "@ronmordo/contracts";

export function mapBoardMemberToDto(member: BoardMember): BoardMemberDto {
  const dto: BoardMemberDto = {
    boardId: member.boardId,
    userId: member.userId,
    role: mapBoardRole(member.role),
    joinedAt: member.joinedAt.toISOString(),
  };
  return BoardMemberDtoSchema.parse(dto);
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
