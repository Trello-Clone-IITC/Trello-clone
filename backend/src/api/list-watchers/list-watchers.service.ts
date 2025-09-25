import { prisma } from "../../lib/prismaClient.js";

const addListWatcher = async (
  listId: string,
  userId: string
): Promise<boolean> => {
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
};

const removeListWatcher = async (
  listId: string,
  userId: string
): Promise<boolean> => {
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
};

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

export default {
  addListWatcher,
  removeListWatcher,
  getListWatchers,
  isUserWatchingList,
};
