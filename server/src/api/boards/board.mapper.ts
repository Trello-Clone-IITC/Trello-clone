import type {
  Board,
  BoardVisibility,
  MemberManageRestrictions,
  CommentingRestrictions,
} from "@prisma/client";
import { type BoardDto, BoardDtoSchema } from "@ronmordo/types";

export function mapBoardToDto(board: Board): BoardDto {
  const dto: BoardDto = {
    id: board.id,
    workspaceId: board.workspaceId,
    name: board.name,
    description: board.description,
    background: board.background,
    createdBy: board.createdBy,
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

// --- ENUM HELPERS ---
function mapBoardVisibility(
  v: BoardVisibility
): "private" | "workspace_members" | "public" {
  switch (v) {
    case "Private":
      return "private";
    case "WorkspaceMembers":
      return "workspace_members";
    case "Public":
      return "public";
  }
}

function mapMemberManage(v: MemberManageRestrictions): "admins" | "members" {
  return v.toLowerCase() as "admins" | "members";
}

function mapCommenting(
  v: CommentingRestrictions
): "disabled" | "board_members" | "workspace_members" {
  switch (v) {
    case "Disabled":
      return "disabled";
    case "BoardMembers":
      return "board_members";
    case "WorkspaceMembers":
      return "workspace_members";
  }
}
