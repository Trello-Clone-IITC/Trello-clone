import { prisma } from "../../lib/prismaClient.js";
import type { List } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const listService = {
  async createList(
    boardId: string,
    listData: {
      name: string;
      position?: number;
      isArchived?: boolean;
      subscribed?: boolean;
    }
  ): Promise<List> {
    // Get the next position if not provided
    let position = listData.position;
    if (position === undefined) {
      const lastList = await prisma.list.findFirst({
        where: { boardId },
        orderBy: { position: "desc" },
      });
      position = lastList ? Number(lastList.position) + 1000 : 1000;
    }

    const list = await prisma.list.create({
      data: {
        boardId,
        name: listData.name,
        position: new Decimal(position),
        isArchived: listData.isArchived ?? false,
        subscribed: listData.subscribed ?? false,
      },
    });

    return list;
  },

  async getListById(id: string): Promise<List | null> {
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
  },

  async getListsByBoard(boardId: string): Promise<List[]> {
    const lists = await prisma.list.findMany({
      where: { 
        boardId,
        isArchived: false, // Only get non-archived lists by default
      },
      include: {
        cards: {
          where: { isArchived: false },
          orderBy: { position: "asc" },
        },
        _count: {
          select: {
            cards: {
              where: { isArchived: false },
            },
          },
        },
      },
      orderBy: { position: "asc" },
    });
    return lists;
  },

  async getAllListsByBoard(boardId: string): Promise<List[]> {
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
  },

  async updateList(
    id: string,
    updates: {
      name?: string;
      position?: number;
      isArchived?: boolean;
      subscribed?: boolean;
    }
  ): Promise<List | null> {
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
  },

  async deleteList(id: string): Promise<boolean> {
    try {
      await prisma.list.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },

  async updateListPosition(
    listId: string,
    newPosition: number
  ): Promise<List | null> {
    try {
      const list = await prisma.list.update({
        where: { id: listId },
        data: { position: new Decimal(newPosition) },
      });
      return list;
    } catch {
      return null;
    }
  },

  async archiveList(
    listId: string,
    isArchived: boolean = true
  ): Promise<List | null> {
    try {
      const list = await prisma.list.update({
        where: { id: listId },
        data: { isArchived },
      });
      return list;
    } catch {
      return null;
    }
  },

  async subscribeToList(
    listId: string,
    subscribed: boolean
  ): Promise<List | null> {
    try {
      const list = await prisma.list.update({
        where: { id: listId },
        data: { subscribed },
      });
      return list;
    } catch {
      return null;
    }
  },

  async reorderLists(
    boardId: string,
    listPositions: { listId: string; position: number }[]
  ): Promise<List[]> {
    const transaction = listPositions.map(({ listId, position }) =>
      prisma.list.update({
        where: { id: listId },
        data: { position: new Decimal(position) },
      })
    );

    const updatedLists = await prisma.$transaction(transaction);
    return updatedLists;
  },

  async getListWithCards(listId: string): Promise<List | null> {
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
  },

  async searchLists(
    boardId: string,
    searchTerm: string,
    limit: number = 10
  ): Promise<List[]> {
    const lists = await prisma.list.findMany({
      where: {
        boardId,
        name: { contains: searchTerm, mode: "insensitive" },
      },
      orderBy: { position: "asc" },
      take: limit,
    });
    return lists;
  },

  // List Watcher Management
  async addListWatcher(listId: string, userId: string): Promise<boolean> {
    try {
      await prisma.listWatcher.create({
        data: {
          listId,
          userId,
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async removeListWatcher(listId: string, userId: string): Promise<boolean> {
    try {
      await prisma.listWatcher.delete({
        where: {
          listId_userId: {
            listId,
            userId,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async getListWatchers(listId: string) {
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
    return watchers;
  },

  async isUserWatchingList(listId: string, userId: string): Promise<boolean> {
    const watcher = await prisma.listWatcher.findUnique({
      where: {
        listId_userId: {
          listId,
          userId,
        },
      },
    });
    return !!watcher;
  },
};


