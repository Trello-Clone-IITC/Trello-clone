import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import { ApiResponse } from "../../utils/globalTypes.js";
import {
  Workspace,
  Board,
  WorkspaceRole,
  WorkspaceType,
  WorkspaceVisibility,
  MembershipRestrictions,
  BoardCreationRestrictions,
  BoardSharing,
  SlackSharing,
} from "@prisma/client";
import type {
  WorkspaceDto,
  WorkspaceMemberDto,
  WorkspaceVisibility as DtoWorkspaceVisibility,
  WorkspaceType as DtoWorkspaceType,
  MembershipRestrictions as DtoMembershipRestrictions,
  BoardCreationRestrictions as DtoBoardCreationRestrictions,
  BoardSharing as DtoBoardSharing,
  SlackSharing as DtoSlackSharing,
  WorkspaceRole as DtoWorkspaceRole,
} from "@ronmordo/types";
import { workspaceService } from "./workspaceService.js";

export const createWorkspace = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto>>,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      createdBy,
      visibility,
      type,
      workspaceMembershipRestrictions,
      publicBoardCreation,
      workspaceBoardCreation,
      privateBoardCreation,
      publicBoardDeletion,
      workspaceBoardDeletion,
      privateBoardDeletion,
      allowGuestSharing,
      allowSlackIntegration,
      premium,
    } = req.body;

    if (!name || !createdBy) {
      return next(new AppError("Name and createdBy are required", 400));
    }

    const workspace = await workspaceService.createWorkspace({
      name,
      description,
      createdBy,
      visibility: visibility || WorkspaceVisibility.Private,
      premium: premium ?? false,
      type: type ?? WorkspaceType.Other,
      workspaceMembershipRestrictions:
        workspaceMembershipRestrictions ?? MembershipRestrictions.Anybody,
      publicBoardCreation:
        publicBoardCreation ?? BoardCreationRestrictions.WorkspaceMember,
      workspaceBoardCreation:
        workspaceBoardCreation ?? BoardCreationRestrictions.WorkspaceMember,
      privateBoardCreation:
        privateBoardCreation ?? BoardCreationRestrictions.WorkspaceMember,
      publicBoardDeletion:
        publicBoardDeletion ?? BoardCreationRestrictions.WorkspaceMember,
      workspaceBoardDeletion:
        workspaceBoardDeletion ?? BoardCreationRestrictions.WorkspaceMember,
      privateBoardDeletion:
        privateBoardDeletion ?? BoardCreationRestrictions.WorkspaceMember,
      allowGuestSharing: allowGuestSharing ?? BoardSharing.Anybody,
      allowSlackIntegration:
        allowSlackIntegration ?? SlackSharing.WorkspaceMember,
    });

    // Transform Prisma workspace to DTO format
    const workspaceDto: WorkspaceDto = {
      ...workspace,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
      visibility: workspace.visibility.toLowerCase() as DtoWorkspaceVisibility,
      type: workspace.type.toLowerCase() as DtoWorkspaceType,
      workspaceMembershipRestrictions:
        workspace.workspaceMembershipRestrictions.toLowerCase() as DtoMembershipRestrictions,
      publicBoardCreation:
        workspace.publicBoardCreation.toLowerCase() as DtoBoardCreationRestrictions,
      workspaceBoardCreation:
        workspace.workspaceBoardCreation.toLowerCase() as DtoBoardCreationRestrictions,
      privateBoardCreation:
        workspace.privateBoardCreation.toLowerCase() as DtoBoardCreationRestrictions,
      publicBoardDeletion:
        workspace.publicBoardDeletion.toLowerCase() as DtoBoardCreationRestrictions,
      workspaceBoardDeletion:
        workspace.workspaceBoardDeletion.toLowerCase() as DtoBoardCreationRestrictions,
      privateBoardDeletion:
        workspace.privateBoardDeletion.toLowerCase() as DtoBoardCreationRestrictions,
      allowGuestSharing:
        workspace.allowGuestSharing.toLowerCase() as DtoBoardSharing,
      allowSlackIntegration:
        workspace.allowSlackIntegration.toLowerCase() as DtoSlackSharing,
    };

    res.status(201).json({
      success: true,
      data: workspaceDto,
    });
  } catch (error) {
    next(new AppError("Failed to create workspace", 500));
  }
};

export const getWorkspace = async (
  req: Request,
  res: Response<ApiResponse<Workspace>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const workspace = await workspaceService.getWorkspaceById(id);

    if (!workspace) {
      return next(new AppError("Workspace not found", 404));
    }

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace", 500));
  }
};

export const updateWorkspace = async (
  req: Request,
  res: Response<ApiResponse<Workspace>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedWorkspace = await workspaceService.updateWorkspace(
      id,
      updates
    );

    if (!updatedWorkspace) {
      return next(new AppError("Workspace not found", 404));
    }

    res.status(200).json({
      success: true,
      data: updatedWorkspace,
    });
  } catch (error) {
    next(new AppError("Failed to update workspace", 500));
  }
};

export const deleteWorkspace = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deleted = await workspaceService.deleteWorkspace(id);

    if (!deleted) {
      return next(new AppError("Workspace not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "Workspace deleted successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to delete workspace", 500));
  }
};

export const getWorkspaceBoards = async (
  req: Request,
  res: Response<ApiResponse<Board[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const boards = await workspaceService.getWorkspaceBoards(id);

    res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace boards", 500));
  }
};

export const getAllWorkspaces = async (
  _req: Request,
  res: Response<ApiResponse<Workspace[]>>,
  next: NextFunction
) => {
  try {
    const workspaces = await workspaceService.getAllWorkspaces();

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(new AppError("Failed to get workspaces", 500));
  }
};

export const getWorkspacesByUser = async (
  req: Request,
  res: Response<ApiResponse<Workspace[]>>,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const workspaces = await workspaceService.getWorkspacesByUser(userId);

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(new AppError("Failed to get workspaces by user", 500));
  }
};

export const getWorkspacesByCreator = async (
  req: Request,
  res: Response<ApiResponse<Workspace[]>>,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const workspaces = await workspaceService.getWorkspacesByCreator(userId);

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(new AppError("Failed to get workspaces by creator", 500));
  }
};

export const getWorkspaceMembers = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const members = await workspaceService.getWorkspaceMembers(id);

    // Transform Prisma workspace members to DTO format
    const memberDtos: WorkspaceMemberDto[] = members.map((member) => ({
      ...member,
      joinedAt: member.joinedAt.toISOString(),
      role: member.role.toLowerCase() as DtoWorkspaceRole,
    }));

    res.status(200).json({
      success: true,
      data: memberDtos,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace members", 500));
  }
};

export const addWorkspaceMember = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const member = await workspaceService.addWorkspaceMember(
      id,
      userId,
      role || WorkspaceRole.Member
    );

    // Transform Prisma workspace member to DTO format
    const memberDto: WorkspaceMemberDto = {
      ...member,
      joinedAt: member.joinedAt.toISOString(),
      role: member.role.toLowerCase() as DtoWorkspaceRole,
    };

    res.status(201).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    next(new AppError("Failed to add workspace member", 500));
  }
};

export const removeWorkspaceMember = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.params;

    const removed = await workspaceService.removeWorkspaceMember(id, userId);

    if (!removed) {
      return next(new AppError("Workspace member not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "Workspace member removed successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to remove workspace member", 500));
  }
};

export const updateWorkspaceMemberRole = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto>>,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;

    const member = await workspaceService.updateWorkspaceMemberRole(
      id,
      userId,
      role
    );

    if (!member) {
      return next(new AppError("Workspace member not found", 404));
    }

    // Transform Prisma workspace member to DTO format
    const memberDto: WorkspaceMemberDto = {
      ...member,
      joinedAt: member.joinedAt.toISOString(),
      role: member.role.toLowerCase() as DtoWorkspaceRole,
    };

    res.status(200).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    next(new AppError("Failed to update workspace member role", 500));
  }
};

export const searchWorkspaces = async (
  req: Request,
  res: Response<ApiResponse<Workspace[]>>,
  next: NextFunction
) => {
  try {
    const { q, limit } = req.query;

    const workspaces = await workspaceService.searchWorkspaces(
      q as string,
      limit ? parseInt(limit as string) : 10
    );

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(new AppError("Failed to search workspaces", 500));
  }
};
