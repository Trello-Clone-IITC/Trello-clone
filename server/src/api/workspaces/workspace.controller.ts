import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { WorkspaceRole } from "@prisma/client";
import {
  type BoardDto,
  type CreateWorkspaceInput,
  type IdParam,
  type UpdateWorkspaceInput,
  type WorkspaceDto,
  type WorkspaceMemberDto,
} from "@ronmordo/types";
import workspaceService from "./workspaceService.js";
import {
  mapWorkspaceDtoToCreateInput,
  mapWorkspaceToDto,
} from "./workspace.mapper.js";
import { mapBoardToDto } from "../boards/board.mapper.js";
import { mapWorkspaceMemberToDto } from "../workspace-members/workspace-members.mapper.js";
import { getAuth } from "@clerk/express";
import { DUMMY_USER_ID } from "../../utils/global.dummy.js";
import { userService } from "../users/user.service.js";

const createWorkspace = async (
  req: Request<{}, {}, CreateWorkspaceInput>,
  res: Response<ApiResponse<WorkspaceDto>>,
  next: NextFunction
) => {
  try {
    let { userId: userClerkId } = getAuth(req) || {};
    if (!userClerkId) {
      userClerkId = DUMMY_USER_ID; //TODO: remove this after testing; Changed to clerkId
    }

    if (!userClerkId) {
      throw new AppError("User not authenticated", 401);
    }

    const userWithId = await userService.getUserIdByClerkId(userClerkId);

    if (!userWithId) {
      throw new AppError("Missing user in database", 500);
    }

    const workspace = await workspaceService.createWorkspace(
      req.body,
      userWithId.id
    );

    return res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    return next(error);
  }
};

const getWorkspace = async (
  req: Request<IdParam>,
  res: Response<ApiResponse<WorkspaceDto>>,
  next: NextFunction
) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.id);

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    return next(error);
  }
};

const updateWorkspace = async (
  req: Request<IdParam, {}, UpdateWorkspaceInput>,
  res: Response<ApiResponse<WorkspaceDto>>,
  next: NextFunction
) => {
  try {
    const updatedWorkspace = await workspaceService.updateWorkspace(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: updatedWorkspace,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteWorkspace = async (
  req: Request<IdParam>,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    await workspaceService.deleteWorkspace(req.params.id);

    return res.status(200).json({
      success: true,
      data: { message: "Workspace deleted successfully" },
    });
  } catch (error) {
    return next(error);
  }
};

const getWorkspaceBoards = async (
  req: Request<IdParam>,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const boards = await workspaceService.getWorkspaceBoards(req.params.id);
    return res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error) {
    return next(error);
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
    return res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    return next(error);
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
    return res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    return next(error);
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
    return res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    return next(error);
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
    return res.status(200).json({
      success: true,
      data: memberDtos,
    });
  } catch (error) {
    return next(error);
  }
};

const addWorkspaceMember = async (
  req: Request,
  res: Response<ApiResponse<WorkspaceMemberDto>>,
  next: NextFunction
) => {
  try {
    console.log("-------------------------1");
    const { id } = req.params;
    const { role } = req.body;
    let { userId } = getAuth(req) || {};
    if (!userId) {
      userId = DUMMY_USER_ID; //TODO: remove this after testing;
    }

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }
    console.log("-------------------------");

    const member = await workspaceService.addWorkspaceMember(
      id,
      userId,
      role || WorkspaceRole.Member
    );

    // Transform Prisma workspace member to DTO format
    const memberDto: WorkspaceMemberDto = mapWorkspaceMemberToDto(member);

    return res.status(201).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    return next(error);
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
      userId = DUMMY_USER_ID; //TODO: remove this after testing;
    }

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const removed = await workspaceService.removeWorkspaceMember(id, userId);

    if (!removed) {
      return next(new AppError("Workspace member not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: { message: "Workspace member removed successfully" },
    });
  } catch (error) {
    return next(error);
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
      userId = DUMMY_USER_ID; //TODO: remove this after testing;
    }

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const member = await workspaceService.updateWorkspaceMemberRole(
      id,
      userId,
      role
    );

    if (!member) {
      throw new AppError("Workspace member not found", 404);
    }

    // Transform Prisma workspace member to DTO format
    const memberDto: WorkspaceMemberDto = mapWorkspaceMemberToDto(member);

    return res.status(200).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    return next(error);
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
    return res.status(200).json({
      success: true,
      data: workspacesDto,
    });
  } catch (error) {
    return next(error);
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
