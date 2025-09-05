import { Prisma, type Board as PrismaBoard, $Enums } from "@prisma/client";
import { type BoardDto, BoardDtoSchema } from "@ronmordo/types";

export function mapBoardToDto(board: PrismaBoard): BoardDto {
  const dto: BoardDto = {
    id: board.id,
    workspaceId: board.workspaceId ?? null,
    name: board.name,
    description: board.description ?? null,
    background: board.background,
    createdBy: board.createdBy ?? null,
    allowCovers: board.allowCovers,
    showComplete: board.showComplete,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
    lastActivityAt: board.lastActivityAt?.toISOString() ?? null,
    visibility: mapBoardVisibility(board.visibility),
    memberManage: mapMemberManage(board.memberManage),
    commenting: mapCommenting(board.commenting),
  };

  return BoardDtoSchema.parse(dto);
}

// --- ENUM HELPERS (Prisma → DTO) ---
function mapBoardVisibility(v: $Enums.BoardVisibility): BoardDto["visibility"] {
  switch (v) {
    case "Private":
      return "private";
    case "WorkspaceMembers":
      return "workspace_members";
    case "Public":
      return "public";
  }
}

function mapMemberManage(
  v: $Enums.MemberManageRestrictions
): BoardDto["memberManage"] {
  return v.toLowerCase() as BoardDto["memberManage"];
}

function mapCommenting(
  v: $Enums.CommentingRestrictions
): BoardDto["commenting"] {
  switch (v) {
    case "Disabled":
      return "disabled";
    case "BoardMembers":
      return "board_members";
    case "WorkspaceMembers":
      return "workspace_members";
  }
}

// --- DTO → Prisma Input ---
export function mapBoardDtoToCreateBoardInput(
  dto: BoardDto
): Prisma.BoardCreateInput {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
    background: dto.background,
    allowCovers: dto.allowCovers,
    showComplete: dto.showComplete,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    lastActivityAt: dto.lastActivityAt
      ? new Date(dto.lastActivityAt)
      : undefined,

    workspace: dto.workspaceId
      ? { connect: { id: dto.workspaceId } }
      : undefined,
    creator: dto.createdBy ? { connect: { id: dto.createdBy } } : undefined,

    visibility: mapBoardVisibilityDtoToPrisma(dto.visibility),
    memberManage: mapMemberManageDtoToPrisma(dto.memberManage),
    commenting: mapCommentingDtoToPrisma(dto.commenting),
  };
}

// --- ENUM HELPERS (DTO → Prisma) ---
function mapBoardVisibilityDtoToPrisma(
  v: BoardDto["visibility"]
): $Enums.BoardVisibility {
  switch (v) {
    case "private":
      return "Private";
    case "workspace_members":
      return "WorkspaceMembers";
    case "public":
      return "Public";
  }
}

function mapMemberManageDtoToPrisma(
  v: BoardDto["memberManage"]
): $Enums.MemberManageRestrictions {
  return v === "admins" ? "Admins" : "Members";
}

function mapCommentingDtoToPrisma(
  v: BoardDto["commenting"]
): $Enums.CommentingRestrictions {
  switch (v) {
    case "disabled":
      return "Disabled";
    case "board_members":
      return "BoardMembers";
    case "workspace_members":
      return "WorkspaceMembers";
  }
}
