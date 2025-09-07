import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import {
  WorkspaceRole,
  WorkspaceType,
  WorkspaceVisibility,
  MembershipRestrictions,
  BoardCreationRestrictions,
  BoardSharing,
  SlackSharing,
} from "@prisma/client";
import type {
  BoardDto,
  WorkspaceDto,
  WorkspaceMemberDto,
} from "@ronmordo/types";
import { workspaceService } from "./workspaceService.js";
import { mapWorkspaceToDto } from "./workspace.mapper.js";
import { mapBoardToDto } from "../boards/board.mapper.js";
import { mapWorkspaceMemberToDto } from "../workspace-members/workspace-members.mapper.js";
import { getAuth } from "@clerk/express";

const createWorkspace = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto>>,
  next: NextFunction
) => {
  try {
    let { userId } = getAuth(req) || {};
    if (!userId) {
      userId = req.body.userId;
    }

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const {
      name,
      description,
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

    if (!name) {
      return next(new AppError("Name is required", 400));
    }

    const workspace = await workspaceService.createWorkspace({
      name,
      description,
      createdBy: userId,
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
    const workspaceDto = mapWorkspaceToDto(workspace);
    res.status(201).json({
      success: true,
      data: workspaceDto,
    });
  } catch (error) {
    console.log("creating workspace error", error);
    next(new AppError("Failed to create workspace", 500));
  }
};

const getWorkspace = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const workspace = await workspaceService.getWorkspaceById(id);

    if (!workspace) {
      return next(new AppError("Workspace not found", 404));
    }
    const workspaceDto = mapWorkspaceToDto(workspace);
    res.status(200).json({
      success: true,
      data: workspaceDto,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace", 500));
  }
};

const updateWorkspace = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto>>,
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
    const updatedWorkspaceDto = mapWorkspaceToDto(updatedWorkspace);
    res.status(200).json({
      success: true,
      data: updatedWorkspaceDto,
    });
  } catch (error) {
    next(new AppError("Failed to update workspace", 500));
  }
};

const deleteWorkspace = async (
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

const getWorkspaceBoards = async (
  req: Request,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const boards = await workspaceService.getWorkspaceBoards(id);
    const boardsDto: BoardDto[] = boards.map(mapBoardToDto);
    res.status(200).json({
      success: true,
      data: boardsDto,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace boards", 500));
  }
};

const getAllWorkspaces = async (
  _req: Request,
  res: Response<ApiResponse<WorkspaceDto[]>>,
  next: NextFunction
) => {
  try {
    const workspaces = await workspaceService.getAllWorkspaces();
    const workspacesDto: WorkspaceDto[] = workspaces.map(mapWorkspaceToDto);
    res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    next(new AppError("Failed to get workspaces", 500));
  }
};

const getWorkspacesByUser = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto[]>>,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const workspaces = await workspaceService.getWorkspacesByUser(userId);
    console.log("workspaces", workspaces);
    const workspacesDto: WorkspaceDto[] = workspaces.map(mapWorkspaceToDto);
    res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    console.log("error", error);
    next(new AppError("Failed to get workspaces by user", 500));
  }
};

const getWorkspacesByCreator = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto[]>>,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const workspaces = await workspaceService.getWorkspacesByCreator(userId);
    const workspacesDto: WorkspaceDto[] = workspaces.map(mapWorkspaceToDto);
    res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    next(new AppError("Failed to get workspaces by creator", 500));
  }
};

const getWorkspaceMembers = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const members = await workspaceService.getWorkspaceMembers(id);

    // Transform Prisma workspace members to DTO format
    const memberDtos: WorkspaceMemberDto[] = members.map(
      mapWorkspaceMemberToDto
    );
    res.status(200).json({
      success: true,
      data: memberDtos,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace members", 500));
  }
};

const addWorkspaceMember = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    let { userId } = getAuth(req) || {};
    if (!userId) {
      userId = req.body.userId;
    }

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const member = await workspaceService.addWorkspaceMember(
      id,
      userId,
      role || WorkspaceRole.Member
    );

    // Transform Prisma workspace member to DTO format
    const memberDto: WorkspaceMemberDto = mapWorkspaceMemberToDto(member);

    res.status(201).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    next(new AppError("Failed to add workspace member", 500));
  }
};

const removeWorkspaceMember = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let { userId } = getAuth(req) || {};
    if (!userId) {
      userId = req.body.userId;
    }

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

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

const updateWorkspaceMemberRole = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    let { userId } = getAuth(req) || {};
    if (!userId) {
      userId = req.body.userId;
    }

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const member = await workspaceService.updateWorkspaceMemberRole(
      id,
      userId,
      role
    );

    if (!member) {
      return next(new AppError("Workspace member not found", 404));
    }

    // Transform Prisma workspace member to DTO format
    const memberDto: WorkspaceMemberDto = mapWorkspaceMemberToDto(member);

    res.status(200).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    next(new AppError("Failed to update workspace member role", 500));
  }
};

const searchWorkspaces = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceDto[]>>,
  next: NextFunction
) => {
  try {
    const { q, limit } = req.query;

    const workspaces = await workspaceService.searchWorkspaces(
      q as string,
      limit ? parseInt(limit as string) : 10
    );

    const workspacesDto: WorkspaceDto[] = workspaces.map(mapWorkspaceToDto);
    res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    next(new AppError("Failed to search workspaces", 500));
  }
};

export default {
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceBoards,
  getAllWorkspaces,
  getWorkspacesByUser,
  getWorkspacesByCreator,
  getWorkspaceMembers,
  addWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
  searchWorkspaces,
};
