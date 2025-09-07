import { prisma } from "../../lib/prismaClient.js";
import {
  type Workspace,
  type WorkspaceMember,
  WorkspaceRole,
} from "@prisma/client";

export const workspaceService = {
  async createWorkspace(
    workspaceData: Omit<Workspace, "id" | "createdAt" | "updatedAt">
  ): Promise<Workspace> {
    const workspace = await prisma.workspace.create({
      data: workspaceData,
    });
    console.log("workspace from service", workspace);
    return workspace;
  },

  async getWorkspaceById(id: string): Promise<Workspace | null> {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });
    return workspace;
  },

  async getWorkspaceWithMembers(
    id: string
  ): Promise<
    (Workspace & { members: WorkspaceMember[]; boards: any[] }) | null
  > {
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
  },

  async getWorkspacesByUser(userId: string): Promise<Workspace[]> {
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
  },

  async getWorkspacesByCreator(createdBy: string): Promise<Workspace[]> {
    const workspaces = await prisma.workspace.findMany({
      where: {
        createdBy,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return workspaces;
  },

  async updateWorkspace(
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
  ): Promise<Workspace | null> {
    const workspace = await prisma.workspace.update({
      where: { id },
      data: updates,
    });
    return workspace;
  },

  async deleteWorkspace(id: string): Promise<boolean> {
    try {
      await prisma.workspace.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async getAllWorkspaces(): Promise<Workspace[]> {
    const workspaces = await prisma.workspace.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return workspaces;
  },

  // Workspace Member Management
  async addWorkspaceMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole = WorkspaceRole.Member
  ): Promise<WorkspaceMember> {
    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
    });
    console.log("member from service", member);
    return member;
  },

  async removeWorkspaceMember(
    workspaceId: string,
    userId: string
  ): Promise<boolean> {
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
  },

  async updateWorkspaceMemberRole(
    workspaceId: string,
    userId: string,
    newRole: WorkspaceRole
  ): Promise<WorkspaceMember | null> {
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
  },

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
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
  },

  async getWorkspaceBoards(workspaceId: string): Promise<any[]> {
    const boards = await prisma.board.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return boards;
  },

  async searchWorkspaces(
    searchTerm: string,
    limit: number = 10
  ): Promise<Workspace[]> {
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
  },
};

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated workspaceService object using Prisma ORM:
 * - createWorkspace: Creates workspace with Prisma
 * - getWorkspaceWithMembers: Gets workspace with members and boards using include
 * - getWorkspacesByUser: Gets workspaces where user is a member
 * - updateWorkspace: Updates workspace using Prisma update
 * - addWorkspaceMember: Adds members to workspaces with proper role typing
 * - removeWorkspaceMember: Removes members using composite key
 * - updateWorkspaceMemberRole: Updates member roles
 * - getWorkspaceMembers: Gets workspace members with user details
 * - getWorkspaceBoards: Gets workspace boards
 * - searchWorkspaces: Searches workspaces with case-insensitive text search
 *
 * All methods use Prisma ORM with proper field names from the schema and include
 * comprehensive workspace management capabilities that align with the database structure.
 */
