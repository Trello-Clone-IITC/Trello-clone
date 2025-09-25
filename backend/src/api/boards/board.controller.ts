import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import boardService from "./board.service.js";
import boardMembersService from "../board-members/board-members.service.js";
import type {
  BoardDto,
  ListDto,
  LabelDto,
  BoardFullDto,
  BoardMemberWithUserDto,
} from "@ronmordo/contracts";
import { mapBoardToDto, mapFullBoardToDto } from "./board.mapper.js";
import { userService } from "../users/user.service.js";

const createBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardDto>>,
  next: NextFunction
) => {
  try {
    const userId =
      (await userService.getUserIdByRequest(req)) ||
      "3f992ec3-fd72-4153-8c8a-9575e5a61867";

    const board = await boardService.createBoard(req.body, userId);
    // Transform Date objects to strings for DTO
    const boardDto: BoardDto = mapBoardToDto(board);

    res.status(201).json({
      success: true,
      data: boardDto,
    });
  } catch (error) {
    next(error);
  }
};

const getBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardDto>>,
  next: NextFunction
) => {
  try {
    const userId = await userService.getUserIdByRequest(req);
    const { id } = req.params;
    const board = await boardService.getBoardById(id, userId);

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

const updateBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    const board = await boardService.updateBoard(id, updateData);

    if (!board) {
      return next(new AppError("Board not found", 404));
    }
    const boardDto: BoardDto = mapBoardToDto(board);
    res.status(200).json({
      success: true,
      data: boardDto,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (
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
    next(error);
  }
};

const getAllBoards = async (
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
    next(error);
  }
};

const getBoardsByUser = async (
  req: Request,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const { userId: paramUserId } = req.params;

    const boards = await boardService.getBoardsByUser(paramUserId);
    const boardsDto: BoardDto[] = boards.map(mapBoardToDto);
    res.status(200).json({
      success: true,
      data: boardsDto,
    });
  } catch (error) {
    next(error);
  }
};

const getBoardMembers = async (
  req: Request,
  res: Response<ApiResponse<BoardMemberWithUserDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const members = await boardMembersService.getBoardMembers(id);
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

const getBoardLists = async (
  req: Request,
  res: Response<ApiResponse<ListDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const lists = await boardService.getBoardLists(id);
    res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    next(error);
  }
};

const getBoardLabels = async (
  req: Request,
  res: Response<ApiResponse<LabelDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const labels = await boardService.getBoardLabels(id);
    res.status(200).json({
      success: true,
      data: labels,
    });
  } catch (error) {
    next(error);
  }
};

const getFullBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardFullDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = await userService.getUserIdByRequest(req);

    if (!userId) {
      throw new AppError("User not authenticated", 403);
    }

    const fullBoard = await boardService.getFullBoard(id);

    if (!fullBoard) {
      return next(new AppError("Board not found", 404));
    }

    const fullBoardDto: BoardFullDto = await mapFullBoardToDto(
      fullBoard,
      userId
    );

    res.status(200).json({
      success: true,
      data: fullBoardDto,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  getAllBoards,
  getBoardsByUser,
  getBoardMembers,
  getBoardLists,
  getBoardLabels,
  getFullBoard,
};
