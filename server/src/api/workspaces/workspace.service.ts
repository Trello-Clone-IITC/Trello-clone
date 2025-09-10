import type {
  BoardDto,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceDto,
} from "@ronmordo/types";
import { prisma } from "../../lib/prismaClient.js";
import {
  type Workspace,
  type WorkspaceMember,
  WorkspaceRole,
} from "@prisma/client";
import {
  mapWorkspaceDtoToCreateInput,
  mapWorkspaceDtoToUpdateInput,
  mapWorkspaceToDto,
} from "./workspace.mapper.js";
import { AppError } from "../../utils/appError.js";
import { mapBoardToDto } from "../boards/board.mapper.js";

const createWorkspace = async (
  workspaceDto: CreateWorkspaceInput,
  creatorId: string
): Promise<WorkspaceDto> => {
  const workspaceData = mapWorkspaceDtoToCreateInput(workspaceDto);

  const workspace = await prisma.workspace.create({
    data: {
      ...workspaceData,
      creator: { connect: { id: creatorId } },
    },
  });

  await addWorkspaceMember(workspace.id, workspace.createdBy, "Admin");

  return mapWorkspaceToDto(workspace);
};

const getWorkspaceById = async (id: string): Promise<WorkspaceDto> => {
  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return mapWorkspaceToDto(workspace);
};

const getWorkspaceWithMembers = async (
  id: string
): Promise<
  (Workspace & { members: WorkspaceMember[]; boards: any[] }) | null
> => {
  const workspace = await prisma.workspace.findUnique({
    where: { id },
    include: {
      workspaceMembers: true,
      boards: true,
    },
  });

  if (!workspace) return null;

  return {
    ...workspace,
    members: workspace.workspaceMembers,
    boards: workspace.boards,
  };
};

const getWorkspacesByUser = async (userId: string): Promise<Workspace[]> => {
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

  return workspaces;
};

const getWorkspacesByCreator = async (
  createdBy: string
): Promise<Workspace[]> => {
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

const updateWorkspace = async (
  id: string,
  updateDtoData: UpdateWorkspaceInput
): Promise<WorkspaceDto> => {
  const updateData = mapWorkspaceDtoToUpdateInput(updateDtoData);

  const workspace = await prisma.workspace.update({
    where: { id },
    data: updateData,
  });

  return mapWorkspaceToDto(workspace);
};

const deleteWorkspace = (id: string) => {
  return prisma.workspace.delete({
    where: { id },
  });
};

const getAllWorkspaces = async (): Promise<Workspace[]> => {
  const workspaces = await prisma.workspace.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return workspaces;
};

// Workspace Member Management
const addWorkspaceMember = async (
  workspaceId: string,
  userId: string,
  role: WorkspaceRole = WorkspaceRole.Member
): Promise<WorkspaceMember> => {
  const member = await prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId,
      role,
    },
  });
  console.log("member from service", member);
  return member;
};

const removeWorkspaceMember = async (
  workspaceId: string,
  userId: string
): Promise<boolean> => {
  try {
    await prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const updateWorkspaceMemberRole = async (
  workspaceId: string,
  userId: string,
  newRole: WorkspaceRole
): Promise<WorkspaceMember | null> => {
  try {
    const member = await prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      data: {
        role: newRole,
      },
    });
    return member;
  } catch (error) {
    return null;
  }
};

const getWorkspaceMembers = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
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

const getWorkspaceBoards = async (workspaceId: string): Promise<BoardDto[]> => {
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

const searchWorkspaces = async (
  searchTerm: string,
  limit: number = 10
): Promise<Workspace[]> => {
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
