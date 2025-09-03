import { prisma } from "../lib/prismaClient.js";
import { AppError } from "../utils/appError.js";

export const WorkspaceService = {
  // Create a new workspace
  async createWorkspace(data) {
    try {
      const workspace = await prisma.workspaces.create({
        data: {
          name: data.name,
          description: data.description,
          created_by: data.created_by,
          visibility: data.visibility,
          premium: data.premium,
          type: data.type,
          workspace_membership_restrictions:
            data.workspace_membership_restrictions,
          public_board_creation: data.public_board_creation,
          workspace_board_creation: data.workspace_board_creation,
          private_board_creation: data.private_board_creation,
          public_board_deletion: data.public_board_deletion,
          workspace_board_deletion: data.workspace_board_deletion,
          private_board_deletion: data.private_board_deletion,
          allow_guest_sharing: data.allow_guest_sharing,
          allow_slack_integration: data.allow_slack_integration,
        },
        include: {
          users: true,
          boards: true,
        },
      });

      return workspace;
    } catch (error) {
      throw new AppError("Failed to create workspace", 500);
    }
  },

  // Get workspace by ID
  async getWorkspaceById(id) {
    try {
      const workspace = await prisma.workspaces.findUnique({
        where: { id },
        include: {
          users: true,
          boards: true,
        },
      });

      return workspace;
    } catch (error) {
      throw new AppError("Failed to get workspace", 500);
    }
  },

  // Update workspace
  async updateWorkspace(id, updates) {
    try {
      const workspace = await prisma.workspaces.update({
        where: { id },
        data: updates,
        include: {
          users: true,
          boards: true,
        },
      });

      return workspace;
    } catch (error) {
      throw new AppError("Failed to update workspace", 500);
    }
  },

  // Delete workspace
  async deleteWorkspace(id) {
    try {
      await prisma.workspaces.delete({
        where: { id },
      });

      return { message: "Workspace deleted successfully" };
    } catch (error) {
      throw new AppError("Failed to delete workspace", 500);
    }
  },

  // Get all workspaces for a user
  async getWorkspacesByUser(userId) {
    try {
      const workspaces = await prisma.workspaces.findMany({
        where: {
          users: {
            some: {
              user_id: userId,
            },
          },
        },
        include: {
          users: true,
          boards: true,
        },
      });

      return workspaces;
    } catch (error) {
      throw new AppError("Failed to get workspaces", 500);
    }
  },
};
