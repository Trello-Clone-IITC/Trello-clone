import type { SearchResultsDto } from "@ronmordo/contracts";
import { prisma } from "../../lib/prismaClient.js";
import { mapBoardBackgroundToDto } from "../boards/board.mapper.js";

const search = async (searchText: string): Promise<SearchResultsDto> => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { fullName: { contains: searchText, mode: "insensitive" } },
        { username: { contains: searchText, mode: "insensitive" } },
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
    },
    select: {
      id: true,
      name: true,
      workspace: {
        select: {
          name: true,
        },
      },
      background: true,
      updatedAt: true,
    },
  });

  const cards = await prisma.card.findMany({
    where: {
      title: { contains: searchText, mode: "insensitive" },
    },
    select: {
      title: true,
      inboxUserId: true,
      list: {
        select: {
          board: {
            select: {
              name: true,
              workspace: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const searchResults: SearchResultsDto = {
    users,
    boards: boards.map((b) => ({
      ...b,
      background: mapBoardBackgroundToDto(b.background),
      updatedAt: b.updatedAt.toISOString(),
    })),
    cards,
  };

  return searchResults;
};

export const searchService = { search };
