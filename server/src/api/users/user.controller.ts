import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { ApiResponse, User, UserWithWorkspaces } from "../../utils/globalTypes";
import { UserService } from "../../services/userService";

export const getUser = async (
  req: Request,
  res: Response<ApiResponse<User>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(new AppError("Failed to get user", 500));
  }
};

export const getUserByClerkId = async (
  req: Request,
  res: Response<ApiResponse<User>>,
  next: NextFunction
) => {
  try {
    const { clerk_id } = req.params;

    const user = await UserService.getUserByClerkId(clerk_id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(new AppError("Failed to get user by Clerk ID", 500));
  }
};

export const getUserWithWorkspaces = async (
  req: Request,
  res: Response<ApiResponse<UserWithWorkspaces>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const workspaces = await UserService.getUserWorkspaces(id);
    const boards = await UserService.getUserBoards(id);

    const userWithWorkspaces: UserWithWorkspaces = {
      ...user,
      workspaces: workspaces,
    };

    res.status(200).json({
      success: true,
      data: userWithWorkspaces,
    });
  } catch (error) {
    next(new AppError("Failed to get user with workspaces", 500));
  }
};

export const updateUser = async (
  req: Request,
  res: Response<ApiResponse<User>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      username,
      full_name,
      avatar_url,
      theme,
      email_notification,
      push_notification,
      bio,
    } = req.body;

    const updatedUser = await UserService.updateUser(id, {
      username,
      full_name,
      avatar_url,
      theme,
      email_notification,
      push_notification,
      bio,
    });

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(new AppError("Failed to update user", 500));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deleted = await UserService.deleteUser(id);

    if (!deleted) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "User deleted successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to delete user", 500));
  }
};

export const searchUsers = async (
  req: Request,
  res: Response<ApiResponse<User[]>>,
  next: NextFunction
) => {
  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== "string") {
      return next(new AppError("Search query is required", 400));
    }

    const limitNum = limit ? parseInt(limit as string) : 10;
    const users = await UserService.searchUsers(q, limitNum);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(new AppError("Failed to search users", 500));
  }
};

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated User controller functions with comprehensive CRUD operations:
 * - getUser: Retrieves user by ID using UserService
 * - getUserByClerkId: New method for Clerk authentication integration
 * - getUserWithWorkspaces: Gets user with their workspace memberships
 * - updateUser: Updates user information with all new fields
 * - deleteUser: Removes user from system
 * - searchUsers: New method for user search functionality
 *
 * All functions now use the UserService for database operations and
 * return data that matches the new comprehensive schema. The controller
 * includes proper error handling and validation.
 */
