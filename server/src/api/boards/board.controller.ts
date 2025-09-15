import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import boardService from "./board.service.js";
import boardMembersService from "../board-members/board-members.service.js";
import type {
  BoardDto,
  BoardMemberDto,
  ListDto,
  LabelDto,
  ActivityLogDto,
  BoardFullDto,
} from "@ronmordo/contracts";
import { mapBoardToDto, mapFullBoardToDto } from "./board.mapper.js";
import { mapBoardMemberToDto } from "../board-members/board-members.mapper.js";
import { mapListToDto } from "../lists/list.mapper.js";
import { mapLabelToDto } from "../labels/label.mapper.js";
import { mapActivityLogToDto } from "../activity-logs/activity-log.mapper.js";
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
    console.log(error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to create board", 500));
  }
};

const getBoard = async (
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
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get board", 500));
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
    console.log("error from update board", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to update board", 500));
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
    console.log("error from delete board", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to delete board", 500));
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
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get boards", 500));
  }
};

const getBoardsByUser = async (
  req: Request,
  res: Response<ApiResponse<BoardDto[]>>,
  next: NextFunction
) => {
  try {
    const { userId: paramUserId } = req.params;
    console.log("paramUserId", paramUserId);

    const boards = await boardService.getBoardsByUser(paramUserId);
    console.log("boards", boards);
    const boardsDto: BoardDto[] = boards.map(mapBoardToDto);
    res.status(200).json({
      success: true,
      data: boardsDto,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get boards by user", 500));
  }
};

const getBoardMembers = async (
  req: Request,
  res: Response<ApiResponse<BoardMemberDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const members = await boardMembersService.getBoardMembers(id);
    const membersDto = members.map(mapBoardMemberToDto);
    res.status(200).json({
      success: true,
      data: membersDto,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get board members", 500));
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
    const listsDto = lists.map(mapListToDto);
    res.status(200).json({
      success: true,
      data: listsDto,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get board lists", 500));
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
    const labelsDto = labels.map(mapLabelToDto);
    res.status(200).json({
      success: true,
      data: labelsDto,
    });
  } catch (error) {
    console.log("error from get board labels", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get board labels", 500));
  }
};

const getBoardActivityLogs = async (
  req: Request,
  res: Response<ApiResponse<ActivityLogDto[]>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const activityLogs = await boardService.getBoardActivityLogs(id);
    const activityLogsDto = activityLogs.map(mapActivityLogToDto);
    res.status(200).json({
      success: true,
      data: activityLogsDto,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get board activity logs", 500));
  }
};

const getFullBoard = async (
  req: Request,
  res: Response<ApiResponse<BoardFullDto>>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const fullBoard = await boardService.getFullBoard(id);

    if (!fullBoard) {
      return next(new AppError("Board not found", 404));
    }

    const fullBoardDto: BoardFullDto = mapFullBoardToDto(fullBoard);

    res.status(200).json({
      success: true,
      data: fullBoardDto,
    });
  } catch (error) {
    console.error("Error in getFullBoard controller:", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to get full board data", 500));
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
  getBoardActivityLogs,
  getFullBoard,
};
