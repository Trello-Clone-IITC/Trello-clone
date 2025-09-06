import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { boardService } from "./boardService.js";
import type {BoardDto,BoardMemberDto} from "@ronmordo/types";
import { mapBoardToDto } from "./board.mapper.js";
import { mapBoardMemberToDto } from "./board-members/board-members.mapper.js";

export const createBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardDto>>,
  next: NextFunction
) => {
  try {
    const board = await boardService.createBoard(req.body);

    // Transform Date objects to strings for DTO
    const boardDto: BoardDto = mapBoardToDto(board);

    res.status(201).json({
      success: true,
      data: boardDto,
    });
  } catch (error) {
    next(new AppError("Failed to create board", 500));
  }
};

export const getBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const board = await boardService.getBoardById(id);

    if (!board) {
      return next(new AppError("Board not found", 404));
    }
    const boardDto: BoardDto = mapBoardToDto(board);


    res.status(200).json({
      success: true,
      data: boardDto,
    });
  } catch (error) {
    next(new AppError("Failed to get board", 500));
  }
};

export const updateBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const board = await boardService.updateBoard(id, req.body);

    if (!board) {
      return next(new AppError("Board not found", 404));
    }
    const boardDto: BoardDto = mapBoardToDto(board);
    res.status(200).json({
      success: true,
      data: boardDto,
    });
  } catch (error) {
    next(new AppError("Failed to update board", 500));
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await boardService.deleteBoard(id);

    if (!deleted) {
      return next(new AppError("Board not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "Board deleted successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to delete board", 500));
  }
};

export const getAllBoards = async (
  _req: Request,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const boards = await boardService.getAllBoards();
    const boardsDto: BoardDto[] = boards.map(mapBoardToDto);
    res.status(200).json({
      success: true,
      data: boardsDto,
    });
  } catch (error) {
    next(new AppError("Failed to get boards", 500));
  }
};

export const getBoardsByWorkspace = async (
  req: Request,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    const boards = await boardService.getBoardsByWorkspace(workspaceId);
    const boardsDto: BoardDto[] = boards.map(mapBoardToDto);
    res.status(200).json({
      success: true,
      data: boardsDto,
    });
  } catch (error) {
    next(new AppError("Failed to get boards by workspace", 500));
  }
};

export const getBoardsByUser = async (
  req: Request,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const boards = await boardService.getBoardsByUser(userId);
    const boardsDto: BoardDto[] = boards.map(mapBoardToDto);
    res.status(200).json({
      success: true,
      data: boardsDto,
    });
  } catch (error) {
    next(new AppError("Failed to get boards by user", 500));
  }
};

export const getBoardMembers = async (
  req: Request,
  res: Response<ApiResponse<BoardMemberDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const members = await boardService.getBoardMembers(id);
    const membersDto = members.map(mapBoardMemberToDto);
    res.status(200).json({
      success: true,
      data: membersDto,
    });
  } catch (error) {
    next(new AppError("Failed to get board members", 500));
  }
};

export const addBoardMember = async (
  req: Request,
  res: Response<ApiResponse<BoardMemberDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;
    const member = await boardService.addBoardMember(id, userId, role);
    const memberDto = mapBoardMemberToDto(member);
    res.status(201).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    next(new AppError("Failed to add board member", 500));
  }
};

export const removeBoardMember = async (
  req: Request,
  res: Response<ApiResponse<{ message: string }>>,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.params;
    const removed = await boardService.removeBoardMember(id, userId);

    if (!removed) {
      return next(new AppError("Board member not found", 404));
    }

    res.status(200).json({
      success: true,
      data: { message: "Board member removed successfully" },
    });
  } catch (error) {
    next(new AppError("Failed to remove board member", 500));
  }
};

export const updateBoardMemberRole = async (
  req: Request,
  res: Response<ApiResponse<BoardMemberDto>>,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;
    const member = await boardService.updateBoardMemberRole(id, userId, role);
    if (!member) {
      return next(new AppError("Board member not found", 404));
    }
    const memberDto = mapBoardMemberToDto(member);

    res.status(200).json({
      success: true,
      data: memberDto,
    });
  } catch (error) {
    next(new AppError("Failed to update board member role", 500));
  }
};

