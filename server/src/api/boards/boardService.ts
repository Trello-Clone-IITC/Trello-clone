import { prisma } from "../../lib/prismaClient.js";
import { Board, BoardMember, List, BoardRole } from "@prisma/client";

export const boardService = {
  async createBoard(
    boardData: Omit<Board, "id" | "createdAt" | "updatedAt">
  ): Promise<Board> {
    const board = await prisma.board.create({
      data: boardData,
    });

    return board;
  },

  async getBoardById(id: string): Promise<Board | null> {
    const board = await prisma.board.findUnique({
      where: { id },
    });
    return board;
  },

  async getBoardWithMembers(id: string) {
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
  },

  async getBoardsByWorkspace(workspaceId: string): Promise<Board[]> {
    const boards = await prisma.board.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return boards;
  },

  async getBoardsByUser(userId: string): Promise<Board[]> {
    const boards = await prisma.board.findMany({
      where: {
        boardMembers: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return boards;
  },

  async updateBoard(
    id: string,
    updates: Partial<
      Pick<
        Board,
        | "name"
        | "description"
        | "background"
        | "allowCovers"
        | "showComplete"
        | "visibility"
        | "memberManage"
        | "commenting"
        | "lastActivityAt"
      >
    >
  ): Promise<Board | null> {
    const board = await prisma.board.update({
      where: { id },
      data: updates,
    });
    return board;
  },

  async deleteBoard(id: string): Promise<boolean> {
    try {
      await prisma.board.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },

  async getAllBoards(): Promise<Board[]> {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: "desc" },
    });
    return boards;
  },

  // Board Member Management
  async addBoardMember(
    boardId: string,
    userId: string,
    role: BoardRole = "Member"
  ): Promise<BoardMember> {
    const member = await prisma.boardMember.create({
      data: {
        boardId,
        userId,
        role,
      },
    });
    return member;
  },

  async removeBoardMember(boardId: string, userId: string): Promise<boolean> {
    try {
      await prisma.boardMember.delete({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async updateBoardMemberRole(
    boardId: string,
    userId: string,
    newRole: BoardRole
  ): Promise<BoardMember | null> {
    try {
      const member = await prisma.boardMember.update({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
        data: { role: newRole },
      });
      return member;
    } catch {
      return null;
    }
  },

  async getBoardMembers(boardId: string): Promise<BoardMember[]> {
    const members = await prisma.boardMember.findMany({
      where: { boardId },
      include: {
        user: true,
      },
      orderBy: { joinedAt: "asc" },
    });
    return members;
  },

  // List Management
  async createList(listData: Omit<List, "id">): Promise<List> {
    const list = await prisma.list.create({
      data: listData,
    });
    return list;
  },

  async getBoardLists(boardId: string): Promise<List[]> {
    const lists = await prisma.list.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });
    return lists;
  },

  async updateListPosition(
    listId: string,
    newPosition: number
  ): Promise<List | null> {
    try {
      const list = await prisma.list.update({
        where: { id: listId },
        data: { position: newPosition },
      });
      return list;
    } catch {
      return null;
    }
  },

  async archiveList(
    listId: string,
    archived: boolean = true
  ): Promise<List | null> {
    try {
      const list = await prisma.list.update({
        where: { id: listId },
        data: { isArchived: archived },
      });
      return list;
    } catch {
      return null;
    }
  },

  async searchBoards(searchTerm: string, limit: number = 10): Promise<Board[]> {
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
  },
};

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated BoardService class matching the new comprehensive database schema:
 * - createBoard: Now supports all new board fields and permission controls
 * - getBoardWithMembers: Gets board with members and lists
 * - getBoardsByWorkspace: Gets boards in a specific workspace
 * - getBoardsByUser: Gets boards where user is a member
 * - updateBoard: Updated to handle all new board fields
 * - addBoardMember: New method for adding members to boards
 * - removeBoardMember: New method for removing members
 * - updateBoardMemberRole: New method for changing member roles
 * - getBoardMembers: New method for getting board members
 * - createList: New method for creating lists
 * - getBoardLists: New method for getting board lists
 * - updateListPosition: New method for reordering lists
 * - archiveList: New method for archiving lists
 * - searchBoards: New method for board search
 *
 * All methods use the correct field names from the new schema and include
 * comprehensive board and list management capabilities that align with the database structure.
 */
