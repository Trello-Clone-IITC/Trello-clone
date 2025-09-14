import { Prisma, type Board as PrismaBoard, $Enums } from "@prisma/client";
import {
  type BoardDto,
  BoardDtoSchema,
  type BoardFullDto,
} from "@ronmordo/types";
import { mapBoardMemberToDto } from "../board-members/board-members.mapper.js";
import { mapListToDto } from "../lists/list.mapper.js";
import { mapLabelToDto } from "../labels/label.mapper.js";
import { mapUserToDto } from "../users/user.mapper.js";
import { mapWorkspaceToDto } from "../workspaces/workspace.mapper.js";
import { mapCardToDto } from "../cards/card.mapper.js";
import { mapListWatcherToDto } from "../list-watchers/list-watcher.mapper.js";

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
  const input: any = {
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

    visibility: mapBoardVisibilityDtoToPrisma(dto.visibility),
    memberManage: mapMemberManageDtoToPrisma(dto.memberManage),
    commenting: mapCommentingDtoToPrisma(dto.commenting),
  };

  if (dto.workspaceId) {
    input.workspace = { connect: { id: dto.workspaceId } };
  }

  if (dto.createdBy) {
    input.creator = { connect: { id: dto.createdBy } };
  }

  return input;
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

// Mapper for full board with all nested data
export function mapFullBoardToDto(board: any): BoardFullDto {
  const dto: BoardFullDto = {
    // Base board data
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

    // Board labels
    labels: board.labels?.map(mapLabelToDto) ?? [],

    // Board members with user details
    members:
      board.boardMembers?.map((member: any) => ({
        ...mapBoardMemberToDto(member),
        user: mapUserToDto(member.user),
      })) ?? [],

    // Board creator
    creator: board.creator ? mapUserToDto(board.creator) : null,

    // Workspace details
    workspace: board.workspace ? mapWorkspaceToDto(board.workspace) : null,

    // Lists with watchers and cards
    lists:
      board.lists?.map((list: any) => ({
        ...mapListToDto(list),
        watchers: list.watchers?.map(mapListWatcherToDto) ?? [],
        cards: list.cards?.map(mapCardToDto) ?? [],
      })) ?? [],
  };

  return dto;
}
