import type { SearchResultsDto } from "@ronmordo/contracts";
import { prisma } from "../../lib/prismaClient.js";
import { mapBoardBackgroundToDto } from "../boards/board.mapper.js";

const search = async (
  searchText: string,
  userId: string
): Promise<SearchResultsDto> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      recentlyViewedBoards: true,
      workspaceMembers: { select: { workspaceId: true } },
      boardMembers: { select: { boardId: true } },
    },
  });

  if (!user) {
    return { users: [], boards: [], cards: [], recentlyViewedBoards: [] };
  }

  const myWorkspaceIds = user.workspaceMembers.map((m) => m.workspaceId);
  const myBoardIds = user.boardMembers.map((m) => m.boardId);

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { fullName: { contains: searchText, mode: "insensitive" } },
        { username: { contains: searchText, mode: "insensitive" } },
      ],
      AND: [
        {
          OR: [
            {
              workspaceMembers: {
                some: { workspaceId: { in: myWorkspaceIds } },
              },
            },
            { boardMembers: { some: { boardId: { in: myBoardIds } } } },
          ],
        },
      ],
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatarUrl: true,
    },
  });

  const boards = await prisma.board.findMany({
    where: {
      name: { contains: searchText, mode: "insensitive" },
      workspaceId: { in: myWorkspaceIds },
    },
    select: {
      id: true,
      name: true,
      workspace: { select: { name: true } },
      background: true,
      updatedAt: true,
    },
  });

  const cards = await prisma.card.findMany({
    where: {
      title: { contains: searchText, mode: "insensitive" },
      OR: [{ list: { boardId: { in: myBoardIds } } }, { inboxUserId: userId }],
    },
    select: {
      id: true,
      title: true,
      inboxUserId: true,
      list: {
        select: {
          board: {
            select: {
              id: true,
              name: true,
              workspace: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  const recentlyViewedBoards = await prisma.board.findMany({
    where: { id: { in: user.recentlyViewedBoards } },
    select: {
      id: true,
      name: true,
      background: true,
      updatedAt: true,
      workspace: { select: { name: true } },
    },
  });

  return {
    users,
    boards: boards.map((b) => ({
      ...b,
      background: mapBoardBackgroundToDto(b.background),
      updatedAt: b.updatedAt.toISOString(),
    })),
    cards,
    recentlyViewedBoards: recentlyViewedBoards.map((b) => ({
      ...b,
      background: mapBoardBackgroundToDto(b.background),
      updatedAt: b.updatedAt.toISOString(),
    })),
  };
};

export const searchService = { search };
