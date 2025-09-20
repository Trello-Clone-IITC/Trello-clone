import { Prisma, $Enums, } from "@prisma/client";
import { BoardDtoSchema, } from "@ronmordo/contracts";
import { mapBoardMemberToDto } from "../board-members/board-members.mapper.js";
import { mapListToDto } from "../lists/list.mapper.js";
import { mapLabelToDto } from "../labels/label.mapper.js";
import { mapUserToDto } from "../users/user.mapper.js";
import { mapWorkspaceToDto } from "../workspaces/workspace.mapper.js";
import { mapListWatcherToDto } from "../list-watchers/list-watcher.mapper.js";
import cardService from "../cards/card.service.js";
export function mapBoardToDto(board) {
    const dto = {
        id: board.id,
        workspaceId: board.workspaceId ?? null,
        name: board.name,
        description: board.description ?? null,
        background: mapBoardBackgroundToDto(board.background),
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
export const mapBoardBackgroundToDto = (background) => {
    return background.toLocaleLowerCase();
};
// --- ENUM HELPERS (Prisma → DTO) ---
function mapBoardVisibility(v) {
    switch (v) {
        case "Private":
            return "private";
        case "WorkspaceMembers":
            return "workspace_members";
        case "Public":
            return "public";
    }
}
function mapMemberManage(v) {
    return v.toLowerCase();
}
function mapCommenting(v) {
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
export function mapBoardDtoToCreateBoardInput(dto) {
    const input = {
        name: dto.name,
        background: mapBoardBackgroundToPrisma(dto.background),
        visibility: mapBoardVisibilityDtoToPrisma(dto.visibility),
        workspace: { connect: { id: dto.workspaceId } },
    };
    return input;
}
// --- DTO → Prisma Update ---
export function mapBoardDtoToUpdateBoardInput(dto) {
    const input = {};
    if (dto.name !== undefined) {
        input.name = dto.name;
    }
    if (dto.background !== undefined) {
        input.background = mapBoardBackgroundToPrisma(dto.background);
    }
    if (dto.visibility !== undefined) {
        input.visibility = mapBoardVisibilityDtoToPrisma(dto.visibility);
    }
    if (dto.workspaceId !== undefined) {
        input.workspace = { connect: { id: dto.workspaceId } };
    }
    if (dto.createdBy !== undefined) {
        input.creator = { connect: { id: dto.createdBy } };
    }
    if (dto.description !== undefined) {
        input.description = dto.description;
    }
    if (dto.memberManage !== undefined) {
        input.memberManage = mapMemberManageDtoToPrisma(dto.memberManage);
    }
    if (dto.commenting !== undefined) {
        input.commenting = mapCommentingDtoToPrisma(dto.commenting);
    }
    return input;
}
export const mapBoardBackgroundToPrisma = (background) => {
    return (background.charAt(0).toUpperCase() +
        background.slice(1));
};
// --- ENUM HELPERS (DTO → Prisma) ---
function mapBoardVisibilityDtoToPrisma(v) {
    switch (v) {
        case "private":
            return "Private";
        case "workspace_members":
            return "WorkspaceMembers";
        case "public":
            return "Public";
    }
}
function mapMemberManageDtoToPrisma(v) {
    return v === "admins" ? "Admins" : "Members";
}
function mapCommentingDtoToPrisma(v) {
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
export async function mapFullBoardToDto(board, userId) {
    const lists = (await Promise.all(board.lists?.map((list) => ({
        ...mapListToDto(list),
        watchers: list.watchers?.map(mapListWatcherToDto) ?? [],
        cards: list.cards?.map((c) => cardService.getCardDto(c, userId)) ?? [],
    })))) ?? [];
    const dto = {
        // Base board data
        id: board.id,
        workspaceId: board.workspaceId ?? null,
        name: board.name,
        description: board.description ?? null,
        background: mapBoardBackgroundToDto(board.background),
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
        members: board.boardMembers?.map((member) => ({
            ...mapBoardMemberToDto(member),
            user: mapUserToDto(member.user),
        })) ?? [],
        // Board creator
        creator: board.creator ? mapUserToDto(board.creator) : null,
        // Workspace details
        workspace: board.workspace ? mapWorkspaceToDto(board.workspace) : null,
        // Lists with watchers and cards
        lists,
    };
    return dto;
}
