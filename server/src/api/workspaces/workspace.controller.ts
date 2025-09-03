import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse, Workspace, Board } from "../../utils/globalTypes.js";
import { WorkspaceService } from "./workspaceService.js";

export const createWorkspace = async (
  req: Request,
  res: Response<ApiResponse<Workspace>>,
  next: NextFunction
) => {
  try {
    const { name, description, created_by } = req.body;

    if (!name || !created_by) {
      return next(new AppError("Name and created_by are required", 400));
    }

    const newWorkspace = await WorkspaceService.createWorkspace({
      name,
      description,
      created_by,
      visibility: "private",
      premium: false,
      type: "other",
      workspace_membership_restrictions: "anybody",
      public_board_creation: "workspace_member",
      workspace_board_creation: "workspace_member",
      private_board_creation: "workspace_member",
      public_board_deletion: "workspace_member",
      workspace_board_deletion: "workspace_member",
      private_board_deletion: "workspace_member",
      allow_guest_sharing: "anybody",
      allow_slack_integration: "workspace_member",
    });

    res.status(201).json({
      success: true,
      data: newWorkspace,
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

    const workspace = await WorkspaceService.getWorkspaceById(id);

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

    const updatedWorkspace = await WorkspaceService.updateWorkspace(
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

    const deleted = await WorkspaceService.deleteWorkspace(id);

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

    const boards = await WorkspaceService.getWorkspaceBoards(id);

    res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error) {
    next(new AppError("Failed to get workspace boards", 500));
  }
};
