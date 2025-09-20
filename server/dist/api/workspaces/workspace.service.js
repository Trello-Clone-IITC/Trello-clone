import { prisma } from "../../lib/prismaClient.js";
import {} from "@prisma/client";
import { mapWorkspaceDtoToCreateInput, mapWorkspaceDtoToUpdateInput, mapWorkspaceToDto, } from "./workspace.mapper.js";
import { AppError } from "../../utils/appError.js";
import { mapBoardToDto } from "../boards/board.mapper.js";
import { mapWorkspaceRoleDto } from "../workspace-members/workspace-members.mapper.js";
import { getCache, setCache } from "../../lib/cache.js";
const createWorkspace = async (workspaceDto, creatorId) => {
    const workspaceData = mapWorkspaceDtoToCreateInput(workspaceDto);
    const workspace = await prisma.workspace.create({
        data: {
            ...workspaceData,
            creator: { connect: { id: creatorId } },
            workspaceMembers: {
                create: {
                    userId: creatorId,
                    role: "Admin",
                },
            },
        },
    });
    return mapWorkspaceToDto(workspace);
};
const getWorkspaceById = async (id) => {
    const cached = await getCache(`workspace:${id}`);
    if (cached) {
        return cached;
    }
    const workspace = await prisma.workspace.findUnique({
        where: { id },
    });
    if (!workspace) {
        throw new AppError("Workspace not found", 404);
    }
    const workspaceDto = mapWorkspaceToDto(workspace);
    setCache(`workspace:${id}`, workspaceDto, 120);
    return workspaceDto;
};
const getWorkspaceWithMembers = async (id) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: {
            workspaceMembers: true,
            boards: true,
        },
    });
    if (!workspace)
        return null;
    return {
        ...workspace,
        members: workspace.workspaceMembers,
        boards: workspace.boards,
    };
};
const getWorkspacesByUser = async (userId) => {
    const cached = await getCache(`user:${userId}:workspaces`);
    if (cached) {
        return cached;
    }
    const workspaces = await prisma.workspace.findMany({
        where: {
            workspaceMembers: {
                some: {
                    userId,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    const workspacesDto = workspaces.map(mapWorkspaceToDto);
    setCache(`user:${userId}:workspaces`, workspacesDto, 120);
    return workspacesDto;
};
const getWorkspacesByCreator = async (createdBy) => {
    const workspaces = await prisma.workspace.findMany({
        where: {
            createdBy,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return workspaces;
};
const updateWorkspace = async (id, updateDtoData) => {
    const updateData = mapWorkspaceDtoToUpdateInput(updateDtoData);
    const workspace = await prisma.workspace.update({
        where: { id },
        data: updateData,
    });
    return mapWorkspaceToDto(workspace);
};
const deleteWorkspace = (id) => {
    return prisma.workspace.delete({
        where: { id },
    });
};
const getAllWorkspaces = async () => {
    const workspaces = await prisma.workspace.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return workspaces;
};
// Workspace Member Management
const addWorkspaceMember = async (workspaceId, newMemberId, role) => {
    const member = await prisma.workspaceMember.create({
        data: {
            workspaceId,
            userId: newMemberId,
            role: mapWorkspaceRoleDto(role),
        },
    });
    console.log("member from service", member);
    return member;
};
const removeWorkspaceMember = async (workspaceId, authUserId, memberIdToDelete) => {
    const authMember = await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId,
                userId: authUserId,
            },
        },
    });
    if (!authMember) {
        throw new AppError("You are not member of this workspace", 403);
    }
    if (memberIdToDelete === authUserId || authMember.role === "Admin") {
        return prisma.workspaceMember.delete({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: memberIdToDelete,
                },
            },
        });
    }
    throw new AppError("You are not authorized to remove this member", 403);
};
const updateWorkspaceMemberRole = async (workspaceId, userId, newRole) => {
    const member = await prisma.workspaceMember.update({
        where: {
            workspaceId_userId: {
                workspaceId,
                userId,
            },
        },
        data: {
            role: mapWorkspaceRoleDto(newRole),
        },
    });
    return member;
};
const getWorkspaceMembers = async (workspaceId) => {
    const members = await prisma.workspaceMember.findMany({
        where: {
            workspaceId,
        },
        include: {
            user: {
                select: {
                    fullName: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },
        orderBy: {
            joinedAt: "asc",
        },
    });
    return members;
};
const getWorkspaceBoards = async (workspaceId) => {
    const boards = await prisma.board.findMany({
        where: {
            workspaceId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return boards.map(mapBoardToDto);
};
const searchWorkspaces = async (searchTerm, limit = 10) => {
    const workspaces = await prisma.workspace.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        },
        orderBy: {
            name: "asc",
        },
        take: limit,
    });
    return workspaces;
};
export default {
    createWorkspace,
    getWorkspaceById,
    getWorkspaceWithMembers,
    getWorkspacesByUser,
    getWorkspacesByCreator,
    updateWorkspace,
    deleteWorkspace,
    getAllWorkspaces,
    addWorkspaceMember,
    removeWorkspaceMember,
    updateWorkspaceMemberRole,
    getWorkspaceMembers,
    getWorkspaceBoards,
    searchWorkspaces,
};
