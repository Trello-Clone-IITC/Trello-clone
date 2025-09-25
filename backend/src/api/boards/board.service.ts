import type {
  BoardDto,
  CreateBoardInput,
  LabelDto,
  ListDto,
  UpdateBoardInput,
} from "@ronmordo/contracts";
import { prisma } from "../../lib/prismaClient.js";
import {
  type Board,
  type List,
  type Label,
  type ActivityLog,
} from "@prisma/client";
import {
  mapBoardDtoToCreateBoardInput,
  mapBoardDtoToUpdateBoardInput,
  mapBoardToDto,
} from "./board.mapper.js";
import { getCache, setCache } from "../../lib/cache.js";
import { mapListToDto } from "../lists/list.mapper.js";
import { mapLabelToDto } from "../labels/label.mapper.js";
import { AppError } from "../../utils/appError.js";

const createBoard = async (
  boardData: CreateBoardInput,
  userId: string
): Promise<Board> => {
  const board = await prisma.board.create({
    data: {
      ...mapBoardDtoToCreateBoardInput(boardData),
      creator: {
        connect: { id: userId },
      },
    },
  });
  return board;
};

const getBoardById = async (id: string, userId: string): Promise<BoardDto> => {
  const cached = await getCache<BoardDto[]>(`user:${userId}:boards`);

  if (cached) {
    const cachedBoard = cached.find((b) => b.id === id);
    if (cachedBoard) {
      return cachedBoard;
    }
  }

  const board = await prisma.board.findUnique({
    where: { id },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  const boardDto = mapBoardToDto(board);

  let updatedCache: BoardDto[];

  if (cached) {
    updatedCache = cached.map((b) => (b.id === id ? boardDto : b));
  } else {
    updatedCache = [boardDto];
  }

  await setCache<BoardDto[]>(`user:${userId}:boards`, updatedCache, 120);

  return boardDto;
};

const getBoardWithMembers = async (id: string) => {
  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      boardMembers: {
        include: {
          user: true,
        },
      },
      lists: true,
    },
  });
  return board;
};

const getBoardsByUser = async (userId: string): Promise<Board[]> => {
  const boards = await prisma.board.findMany({
    where: {
      OR: [{ createdBy: userId }, { boardMembers: { some: { userId } } }],
    },
    orderBy: { createdAt: "desc" },
  });
  return boards;
};

const updateBoard = async (
  id: string,
  updates: UpdateBoardInput
): Promise<Board | null> => {
  const board = await prisma.board.update({
    where: { id },
    data: mapBoardDtoToUpdateBoardInput(updates),
  });
  return board;
};

const deleteBoard = async (id: string): Promise<boolean> => {
  try {
    await prisma.board.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
};

const getAllBoards = async (): Promise<Board[]> => {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: "desc" },
  });
  return boards;
};

// List Management
const createList = async (listData: Omit<List, "id">): Promise<List> => {
  const list = await prisma.list.create({
    data: listData,
  });
  return list;
};

const getBoardLists = async (boardId: string): Promise<ListDto[]> => {
  const cached = await getCache<ListDto[]>(`board:${boardId}:lists`);

  if (cached) {
    return cached;
  }

  const lists = await prisma.list.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  });

  const listsDto = await Promise.all(lists.map(mapListToDto));

  await setCache<ListDto[]>(`board:${boardId}:lists`, listsDto, 120);

  return listsDto;
};

const getBoardLabels = async (boardId: string): Promise<LabelDto[]> => {
  const cached = await getCache<LabelDto[]>(`board:${boardId}:labels`);

  if (cached) {
    return cached;
  }

  const labels = await prisma.label.findMany({
    where: { boardId: boardId },
    orderBy: { name: "asc" },
  });

  const labelsDto = labels.map(mapLabelToDto);

  await setCache<LabelDto[]>(`board:${boardId}:labels`, labelsDto, 60);

  return labelsDto;
};

const getBoardActivityLogs = async (
  boardId: string
): Promise<ActivityLog[]> => {
  const activityLogs = await prisma.activityLog.findMany({
    where: { boardId },
    orderBy: { createdAt: "desc" },
  });
  return activityLogs;
};

const updateListPosition = async (
  listId: string,
  newPosition: number
): Promise<List | null> => {
  try {
    const list = await prisma.list.update({
      where: { id: listId },
      data: { position: newPosition },
    });
    return list;
  } catch {
    return null;
  }
};

const archiveList = async (
  listId: string,
  archived: boolean = true
): Promise<List | null> => {
  try {
    const list = await prisma.list.update({
      where: { id: listId },
      data: { isArchived: archived },
    });
    return list;
  } catch {
    return null;
  }
};

const searchBoards = async (
  searchTerm: string,
  limit: number = 10
): Promise<Board[]> => {
  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
    take: limit,
  });
  return boards;
};

const getFullBoard = async (boardId: string) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        // Board creator
        creator: {
          select: {
            id: true,
            clerkId: true,
            email: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            theme: true,
            emailNotification: true,
            pushNotification: true,
            createdAt: true,
            bio: true,
          },
        },
        // Workspace details
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
            visibility: true,
            premium: true,
            createdAt: true,
            updatedAt: true,
            type: true,
            createdBy: true,
            workspaceMembershipRestrictions: true,
            publicBoardCreation: true,
            workspaceBoardCreation: true,
            privateBoardCreation: true,
            publicBoardDeletion: true,
            workspaceBoardDeletion: true,
            privateBoardDeletion: true,
            allowGuestSharing: true,
            allowSlackIntegration: true,
          },
        },
        // Board labels
        labels: {
          orderBy: { name: "asc" },
        },
        // Board members with user details
        boardMembers: {
          include: {
            user: {
              select: {
                id: true,
                clerkId: true,
                email: true,
                username: true,
                fullName: true,
                avatarUrl: true,
                theme: true,
                emailNotification: true,
                pushNotification: true,
                createdAt: true,
                bio: true,
              },
            },
          },
        },
        // Lists with watchers and cards
        lists: {
          where: { isArchived: false },
          orderBy: { position: "asc" },
          include: {
            // List watchers
            watchers: {
              orderBy: { createdAt: "asc" },
            },
            // Cards (basic data only)
            cards: {
              where: { isArchived: false },
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });
    return board;
  } catch (error) {
    console.error("Error in getFullBoard service:", error);
    throw error;
  }
};

export default {
  createBoard,
  getBoardById,
  getBoardWithMembers,
  getBoardsByUser,
  updateBoard,
  deleteBoard,
  getAllBoards,
  createList,
  getBoardLists,
  getBoardLabels,
  getBoardActivityLogs,
  updateListPosition,
  archiveList,
  searchBoards,
  getFullBoard,
};
