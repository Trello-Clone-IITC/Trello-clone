import { prisma } from "../../lib/prismaClient.js";
import type { List } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type {
  CreateListInput,
  ListDto,
  ListWatcherDto,
  ListWithCardsAndWatchersDto,
  UpdateListInput,
  UserDto,
} from "@ronmordo/contracts";
import { AppError } from "../../utils/appError.js";
import cardService from "../cards/card.service.js";
import { getCache, setCache } from "../../lib/cache.js";
import { mapFullListToDto, mapListToDto } from "./list.mapper.js";
import { mapListWatcherToDto } from "../list-watchers/list-watcher.mapper.js";
import listController from "./list.controller.js";

const createList = async (
  data: CreateListInput,
  boardId: string
): Promise<ListDto> => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      lists: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  const lastList = board.lists.pop();
  let newPosition = lastList
    ? lastList.position.add(new Decimal(1000))
    : new Decimal(1000);

  const list = await prisma.list.create({
    data: {
      ...data,
      position: newPosition,
      board: { connect: { id: boardId } },
    },
  });

  const listDto: ListDto = mapListToDto(list);

  const cached = await getCache<ListDto[]>(`board:${boardId}:lists`);

  await setCache<ListDto[]>(
    `board:${boardId}:lists`,
    cached ? [listDto, ...cached] : [listDto],
    120
  );

  return listDto;
};

const getListById = async (id: string, userId: string): Promise<ListDto> => {
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      cards: {
        orderBy: { position: "asc" },
      },
      watchers: true,
    },
  });

  if (!list) {
    throw new AppError("List not found", 404);
  }

  const listDto: ListWithCardsAndWatchersDto = await mapFullListToDto(
    list,
    userId
  );

  return listDto;
};

// const getAllListsByBoard = async (boardId: string): Promise<ListDto[]> => {
//   const cached = await getCache<ListDto[]>(`board:${boardId}:lists`);

//   if (cached) {
//     return cached;
//   }

//   const lists = await prisma.list.findMany({
//     where: { boardId },
//     include: {
//       cards: {
//         orderBy: { position: "asc" },
//       },
//       _count: {
//         select: {
//           cards: true,
//         },
//       },
//     },
//     orderBy: { position: "asc" },
//   });

//   return lists;
// };

const updateList = async (
  id: string,
  updates: UpdateListInput
): Promise<ListDto> => {
  const list = await prisma.list.update({
    where: { id },
    data: updates,
  });

  const listDto = mapListToDto(list);

  const cached = await getCache<ListDto[]>(`board:${list.boardId}:lists`);

  let updatedCache: ListDto[];

  if (cached) {
    updatedCache = cached.map((l) => (l.id === id ? listDto : l));
  } else {
    updatedCache = [listDto];
  }

  await setCache<ListDto[]>(`board:${list.boardId}:lists`, updatedCache, 120);

  return listDto;
};

const deleteList = async (id: string): Promise<boolean> => {
  try {
    const deletedList = await prisma.list.delete({
      where: { id },
    });

    const cached = await getCache<ListDto[]>(
      `board:${deletedList.boardId}:lists`
    );

    if (cached) {
      await setCache<ListDto[]>(
        `board:${deletedList.boardId}:lists`,
        cached.filter((l) => l.id !== id),
        120
      );
    }

    return true;
  } catch {
    return false;
  }
};

const getListWithCards = async (listId: string): Promise<List | null> => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: {
      cards: {
        where: { isArchived: false },
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
          cardLabels: {
            include: {
              label: true,
            },
          },
          _count: {
            select: {
              comments: true,
              checklists: true,
              attachments: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
      board: {
        select: {
          id: true,
          name: true,
          visibility: true,
        },
      },
    },
  });
  return list;
};

const searchLists = async (
  boardId: string,
  searchTerm: string,
  limit: number = 10
): Promise<List[]> => {
  const lists = await prisma.list.findMany({
    where: {
      boardId,
      name: { contains: searchTerm, mode: "insensitive" },
    },
    orderBy: { position: "asc" },
    take: limit,
  });
  return lists;
};

// List Watcher Management

const getListWatchers = async (listId: string) => {
  const cached = await getCache<
    Array<
      ListWatcherDto & {
        user: Pick<UserDto, "id" | "avatarUrl" | "fullName" | "email">;
      }
    >
  >(`list:${listId}:watchers`);

  if (cached) {
    return cached;
  }

  const watchers = await prisma.listWatcher.findMany({
    where: { listId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const watchersDto = watchers.map((w) => ({
    ...w,
    ...mapListWatcherToDto(w),
  }));

  await setCache<
    Array<
      ListWatcherDto & {
        user: Pick<UserDto, "id" | "avatarUrl" | "fullName" | "email">;
      }
    >
  >(`list:${listId}:watchers`, watchersDto, 120);

  return watchersDto;
};

const getCardsByList = async (listId: string, userId: string) => {
  // Verify user has access to the list

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      board: {
        boardMembers: {
          some: { userId },
        },
      },
    },
    include: {
      cards: {
        orderBy: { position: "asc" },
        where: {
          isArchived: false,
        },
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
          cardLabels: {
            include: {
              label: true,
            },
          },
          checklists: {
            include: {
              items: {
                where: {
                  isCompleted: true,
                },
              },
            },
          },
          comments: true,
          attachments: true,
        },
      },
    },
  });

  if (!list) {
    throw new AppError("List not found", 404);
  }

  const cards = list.cards;

  return Promise.all(cards.map((c) => cardService.getCardDto(c, userId)));
};

export default {
  createList,
  getListById,
  // getAllListsByBoard,
  updateList,
  deleteList,
  getListWithCards,
  searchLists,
  getListWatchers,
  getCardsByList,
};
