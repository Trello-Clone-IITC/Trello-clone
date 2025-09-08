import { prisma } from "../../lib/prismaClient.js";
import {
  type Workspace,
  type WorkspaceMember,
  WorkspaceRole,
} from "@prisma/client";

const createWorkspace = async (
  workspaceData: Omit<Workspace, "id" | "createdAt" | "updatedAt">
): Promise<Workspace> => {
  const workspace = await prisma.workspace.create({
    data: workspaceData,
  });
  console.log("workspace from service", workspace);
  return workspace;
};

const getWorkspaceById = async (id: string): Promise<Workspace | null> => {
  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });
  return workspace;
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

const getWorkspacesByCreator = async (createdBy: string): Promise<Workspace[]> => {
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
  updates: Partial<
    Pick<
      Workspace,
      | "name"
      | "description"
      | "visibility"
      | "premium"
      | "type"
      | "workspaceMembershipRestrictions"
      | "publicBoardCreation"
      | "workspaceBoardCreation"
      | "privateBoardCreation"
      | "publicBoardDeletion"
      | "workspaceBoardDeletion"
      | "privateBoardDeletion"
      | "allowGuestSharing"
      | "allowSlackIntegration"
    >
  >
): Promise<Workspace | null> => {
  const workspace = await prisma.workspace.update({
    where: { id },
    data: updates,
  });
  return workspace;
};

const deleteWorkspace = async (id: string): Promise<boolean> => {
  try {
    await prisma.workspace.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
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

const getWorkspaceMembers = async (workspaceId: string): Promise<WorkspaceMember[]> => {
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

const getWorkspaceBoards = async (workspaceId: string): Promise<any[]> => {
  const boards = await prisma.board.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return boards;
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