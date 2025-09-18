import { prisma } from "../../lib/prismaClient.js";
import type { List } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type { CreateListInput } from "@ronmordo/contracts";
import { AppError } from "../../utils/appError.js";
import cardService from "../cards/card.service.js";

const createList = async (
  data: CreateListInput,
  boardId: string
): Promise<List> => {
  // Get the next position if not provided
  const list = await prisma.list.create({
    data: {
      ...data,
      board: { connect: { id: boardId } },
    },
  });

  return list;
};

const getListById = async (id: string): Promise<List | null> => {
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      cards: {
        orderBy: { position: "asc" },
      },
      watchers: {
        include: {
          user: true,
        },
      },
    },
  });
  return list;
};

const getAllListsByBoard = async (boardId: string): Promise<List[]> => {
  const lists = await prisma.list.findMany({
    where: { boardId },
    include: {
      cards: {
        orderBy: { position: "asc" },
      },
      _count: {
        select: {
          cards: true,
        },
      },
    },
    orderBy: { position: "asc" },
  });
  return lists;
};

const updateList = async (
  id: string,
  updates: {
    name?: string;
    position?: number;
    isArchived?: boolean;
    subscribed?: boolean;
  }
): Promise<List | null> => {
  try {
    const updateData: any = { ...updates };
    if (updates.position !== undefined) {
      updateData.position = new Decimal(updates.position);
    }

    const list = await prisma.list.update({
      where: { id },
      data: updateData,
    });
    return list;
  } catch {
    return null;
  }
};

const deleteList = async (id: string): Promise<boolean> => {
  try {
    await prisma.list.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
};

const updateListPosition = async (
  listId: string,
  newPosition: number
): Promise<List | null> => {
  try {
    const list = await prisma.list.update({
      where: { id: listId },
      data: { position: new Decimal(newPosition) },
    });
    return list;
  } catch {
    return null;
  }
};

const archiveList = async (
  listId: string,
  isArchived: boolean = true
): Promise<List | null> => {
  try {
    const list = await prisma.list.update({
      where: { id: listId },
      data: { isArchived },
    });
    return list;
  } catch {
    return null;
  }
};

const subscribeToList = async (
  listId: string,
  subscribed: boolean
): Promise<List | null> => {
  try {
    const list = await prisma.list.update({
      where: { id: listId },
      data: { subscribed },
    });
    return list;
  } catch {
    return null;
  }
};

const reorderLists = async (
  listPositions: { listId: string; position: number }[]
): Promise<List[]> => {
  const transaction = listPositions.map(({ listId, position }) =>
    prisma.list.update({
      where: { id: listId },
      data: { position: new Decimal(position) },
    })
  );

  const updatedLists = await prisma.$transaction(transaction);
  return updatedLists;
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
  console.log("watchers", watchers);

  return watchers;
};

const isUserWatchingList = async (
  listId: string,
  userId: string
): Promise<boolean> => {
  const watcher = await prisma.listWatcher.findUnique({
    where: {
      listId_userId: {
        listId,
        userId,
      },
    },
  });
  return !!watcher;
};

const getCardsByList = async (listId: string, userId: string) => {
  // Verify user has access to the list
  console.log(listId,userId);
  
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
  console.log(list);
  

  if (!list) {
    throw new AppError("List not found", 404);
  }

  const cards = list.cards;

  return Promise.all(cards.map((c) => cardService.getCardDto(c, userId)));
};

export default {
  createList,
  getListById,
  getAllListsByBoard,
  updateList,
  deleteList,
  updateListPosition,
  archiveList,
  subscribeToList,
  reorderLists,
  getListWithCards,
  searchLists,
  getListWatchers,
  isUserWatchingList,
  getCardsByList,
};
