import OpenAI from "openai";
import { prisma } from "../../lib/prismaClient.js";
import type {
  UpdateCardInput,
  CreateCardInput,
  CreateBoardInput,
  CreateListInput,
  CreateWorkspaceInput,
  UpdateBoardInput,
  UpdateListInput,
  UpdateWorkspaceInput,
  BoardBackground,
  BoardVisibility,
  WorkspaceType,
  WorkspaceVisibility,
} from "@ronmordo/contracts";
import cardService from "../cards/card.service.js";
import boardService from "../boards/board.service.js";
import listService from "../lists/list.service.js";
import workspaceService from "../workspaces/workspace.service.js";
import { env } from "../../config/env.js";

// Initialize OpenAI client
const { OPENAI_API_KEY } = env;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Define the available functions for the AI
const availableFunctions = {
  // ==========================
  // CARD OPERATIONS
  // ==========================
  createCard: {
    name: "createCard",
    description:
      "Create a new card. Cards can belong to a list (listId) or user inbox (inboxUserId). One of them must be provided.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the card",
        },
        description: {
          type: "string",
          description: "The description of the card (optional)",
        },
        listId: {
          type: "string",
          description:
            "The ID of the list where the card should be created (optional if inboxUserId is provided)",
        },
        listName: {
          type: "string",
          description:
            "The name of the list where the card should be created (optional if listId is provided)",
        },
        boardId: {
          type: "string",
          description:
            "The ID of the board containing the list (required if using listName)",
        },
        inboxUserId: {
          type: "string",
          description:
            "The user ID to add the card to their inbox (optional if listId is provided)",
        },
        position: {
          type: "number",
          description:
            "The position of the card (optional, auto-calculated if not provided)",
        },
        dueDate: {
          type: "string",
          description: "The due date for the card in ISO format (optional)",
        },
        startDate: {
          type: "string",
          description: "The start date for the card in ISO format (optional)",
        },
        coverImageUrl: {
          type: "string",
          description: "The cover image URL for the card (optional)",
        },
        location: {
          type: "object",
          description: "The location of the card (optional)",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" },
            address: { type: "string" },
          },
        },
      },
      required: ["title"],
    },
  },
  updateCard: {
    name: "updateCard",
    description:
      "Update an existing card. Can move between lists and inbox, update position, status, etc.",
    parameters: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "The ID of the card to update",
        },
        title: {
          type: "string",
          description: "The new title of the card (optional)",
        },
        description: {
          type: "string",
          description: "The new description of the card (optional)",
        },
        position: {
          type: "number",
          description: "The new position of the card (optional)",
        },
        listId: {
          type: "string",
          description:
            "The ID of the list to move the card to (optional, set to null to move to inbox)",
        },
        inboxUserId: {
          type: "string",
          description:
            "The user ID to move the card to their inbox (optional, set to null to move to list)",
        },
        isCompleted: {
          type: "boolean",
          description: "Whether the card is completed (optional)",
        },
        isArchived: {
          type: "boolean",
          description: "Whether the card is archived (optional)",
        },
        dueDate: {
          type: "string",
          description: "The due date for the card in ISO format (optional)",
        },
        startDate: {
          type: "string",
          description: "The start date for the card in ISO format (optional)",
        },
        coverImageUrl: {
          type: "string",
          description: "The cover image URL for the card (optional)",
        },
        location: {
          type: "object",
          description: "The location of the card (optional)",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" },
            address: { type: "string" },
          },
        },
      },
      required: ["cardId"],
    },
  },
  getCard: {
    name: "getCard",
    description: "Get detailed information about a specific card",
    parameters: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "The ID of the card to retrieve",
        },
      },
      required: ["cardId"],
    },
  },
  deleteCard: {
    name: "deleteCard",
    description: "Delete a card permanently",
    parameters: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "The ID of the card to delete",
        },
      },
      required: ["cardId"],
    },
  },
  searchCards: {
    name: "searchCards",
    description: "Search for cards by title or description",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        boardId: {
          type: "string",
          description: "The ID of the board to search in (optional)",
        },
      },
      required: ["query"],
    },
  },
  // ==========================
  // BOARD OPERATIONS
  // ==========================
  createBoard: {
    name: "createBoard",
    description: "Create a new board in a workspace",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the board",
        },
        description: {
          type: "string",
          description: "The description of the board (optional)",
        },
        workspaceId: {
          type: "string",
          description:
            "The ID of the workspace where the board should be created (optional if workspaceName is provided)",
        },
        workspaceName: {
          type: "string",
          description:
            "The name of the workspace where the board should be created (optional if workspaceId is provided)",
        },
        background: {
          type: "string",
          description: "The background theme for the board (optional)",
          enum: ["mountain", "valley", "tree", "snow"],
        },
        visibility: {
          type: "string",
          description: "The visibility of the board (optional)",
          enum: ["private", "workspace_members", "public"],
        },
        allowCovers: {
          type: "boolean",
          description: "Whether to allow cover images on cards (optional)",
        },
        showComplete: {
          type: "boolean",
          description: "Whether to show completed cards (optional)",
        },
        memberManage: {
          type: "string",
          description: "Who can manage members (optional)",
          enum: ["admins", "members"],
        },
        commenting: {
          type: "string",
          description: "Who can comment (optional)",
          enum: ["disabled", "board_members", "workspace_members"],
        },
      },
      required: ["name"],
    },
  },
  updateBoard: {
    name: "updateBoard",
    description: "Update an existing board",
    parameters: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The ID of the board to update",
        },
        name: {
          type: "string",
          description: "The new name of the board (optional)",
        },
        description: {
          type: "string",
          description: "The new description of the board (optional)",
        },
        background: {
          type: "string",
          description: "The background theme for the board (optional)",
          enum: ["mountain", "valley", "tree", "snow"],
        },
        visibility: {
          type: "string",
          description: "The visibility of the board (optional)",
          enum: ["private", "workspace_members", "public"],
        },
        allowCovers: {
          type: "boolean",
          description: "Whether to allow cover images on cards (optional)",
        },
        showComplete: {
          type: "boolean",
          description: "Whether to show completed cards (optional)",
        },
        memberManage: {
          type: "string",
          description: "Who can manage members (optional)",
          enum: ["admins", "members"],
        },
        commenting: {
          type: "string",
          description: "Who can comment (optional)",
          enum: ["disabled", "board_members", "workspace_members"],
        },
      },
      required: ["boardId"],
    },
  },
  getBoard: {
    name: "getBoard",
    description: "Get detailed information about a specific board",
    parameters: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The ID of the board to retrieve",
        },
      },
      required: ["boardId"],
    },
  },
  deleteBoard: {
    name: "deleteBoard",
    description: "Delete a board permanently",
    parameters: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The ID of the board to delete",
        },
      },
      required: ["boardId"],
    },
  },
  // ==========================
  // LIST OPERATIONS
  // ==========================
  createList: {
    name: "createList",
    description: "Create a new list in a board",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the list",
        },
        boardId: {
          type: "string",
          description:
            "The ID of the board where the list should be created (optional if boardName is provided)",
        },
        boardName: {
          type: "string",
          description:
            "The name of the board where the list should be created (optional if boardId is provided)",
        },
        position: {
          type: "number",
          description:
            "The position of the list in the board (optional, auto-calculated if not provided)",
        },
        isArchived: {
          type: "boolean",
          description: "Whether the list is archived (optional)",
        },
        subscribed: {
          type: "boolean",
          description: "Whether the user is subscribed to the list (optional)",
        },
      },
      required: ["name"],
    },
  },
  updateList: {
    name: "updateList",
    description: "Update an existing list",
    parameters: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "The ID of the list to update",
        },
        name: {
          type: "string",
          description: "The new name of the list (optional)",
        },
        position: {
          type: "number",
          description: "The new position of the list (optional)",
        },
        isArchived: {
          type: "boolean",
          description: "Whether the list is archived (optional)",
        },
        subscribed: {
          type: "boolean",
          description: "Whether the user is subscribed to the list (optional)",
        },
      },
      required: ["listId"],
    },
  },
  getList: {
    name: "getList",
    description: "Get detailed information about a specific list",
    parameters: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "The ID of the list to retrieve",
        },
      },
      required: ["listId"],
    },
  },
  deleteList: {
    name: "deleteList",
    description: "Delete a list permanently",
    parameters: {
      type: "object",
      properties: {
        listId: {
          type: "string",
          description: "The ID of the list to delete",
        },
      },
      required: ["listId"],
    },
  },
  getListsByBoard: {
    name: "getListsByBoard",
    description: "Get all lists in a board",
    parameters: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The ID of the board to get lists from",
        },
      },
      required: ["boardId"],
    },
  },
  // ==========================
  // WORKSPACE OPERATIONS
  // ==========================
  createWorkspace: {
    name: "createWorkspace",
    description: "Create a new workspace",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the workspace",
        },
        description: {
          type: "string",
          description: "The description of the workspace (optional)",
        },
        type: {
          type: "string",
          description: "The type of workspace (optional)",
          enum: [
            "marketing",
            "sales_crm",
            "human_resources",
            "small_business",
            "engineering_it",
            "education",
            "operations",
            "other",
          ],
        },
        visibility: {
          type: "string",
          description: "The visibility of the workspace (optional)",
          enum: ["private", "public"],
        },
      },
      required: ["name"],
    },
  },
  updateWorkspace: {
    name: "updateWorkspace",
    description: "Update an existing workspace",
    parameters: {
      type: "object",
      properties: {
        workspaceId: {
          type: "string",
          description: "The ID of the workspace to update",
        },
        name: {
          type: "string",
          description: "The new name of the workspace (optional)",
        },
        description: {
          type: "string",
          description: "The new description of the workspace (optional)",
        },
        type: {
          type: "string",
          description: "The type of workspace (optional)",
          enum: [
            "marketing",
            "sales_crm",
            "human_resources",
            "small_business",
            "engineering_it",
            "education",
            "operations",
            "other",
          ],
        },
        visibility: {
          type: "string",
          description: "The visibility of the workspace (optional)",
          enum: ["private", "public"],
        },
      },
      required: ["workspaceId"],
    },
  },
  getWorkspace: {
    name: "getWorkspace",
    description: "Get detailed information about a specific workspace",
    parameters: {
      type: "object",
      properties: {
        workspaceId: {
          type: "string",
          description: "The ID of the workspace to retrieve",
        },
      },
      required: ["workspaceId"],
    },
  },
  deleteWorkspace: {
    name: "deleteWorkspace",
    description: "Delete a workspace permanently",
    parameters: {
      type: "object",
      properties: {
        workspaceId: {
          type: "string",
          description: "The ID of the workspace to delete",
        },
      },
      required: ["workspaceId"],
    },
  },
  getWorkspaces: {
    name: "getWorkspaces",
    description: "Get all workspaces the user has access to",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  createMultipleCards: {
    name: "createMultipleCards",
    description: "Create multiple cards efficiently in a single operation",
    parameters: {
      type: "object",
      properties: {
        cards: {
          type: "array",
          description: "Array of card data to create",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "The title of the card" },
              description: {
                type: "string",
                description: "The description of the card (optional)",
              },
              listId: {
                type: "string",
                description:
                  "The ID of the list where the card should be created",
              },
              position: {
                type: "number",
                description: "The position of the card (optional)",
              },
            },
            required: ["title", "listId"],
          },
        },
        boardId: {
          type: "string",
          description: "The ID of the board containing the lists",
        },
      },
      required: ["cards"],
    },
  },
};

// Helper function to clean responses and hide internal IDs
const cleanResponse = (data: any, type: string, name?: string) => {
  if (!data) return data;

  // Remove internal IDs and sensitive data
  const cleaned = { ...data };
  delete cleaned.id;
  delete cleaned.cardId;
  delete cleaned.listId;
  delete cleaned.boardId;
  delete cleaned.workspaceId;
  delete cleaned.userId;
  delete cleaned.createdBy;
  delete cleaned.updatedAt;
  delete cleaned.createdAt;

  // Add a friendly message
  if (name) {
    return {
      success: true,
      message: `Successfully ${type} '${name}'`,
      data: cleaned,
    };
  }

  return {
    success: true,
    data: cleaned,
  };
};

// Helper function to clean function results
const cleanFunctionResult = (result: any) => {
  if (!result || !result.success) return result;

  // Clean the result data
  if (result.card) {
    result.card = cleanResponse(result.card, "", "");
  }
  if (result.board) {
    result.board = cleanResponse(result.board, "", "");
  }
  if (result.list) {
    result.list = cleanResponse(result.list, "", "");
  }
  if (result.workspace) {
    result.workspace = cleanResponse(result.workspace, "", "");
  }
  if (result.cards && Array.isArray(result.cards)) {
    result.cards = result.cards.map((card: any) => cleanResponse(card, "", ""));
  }
  if (result.lists && Array.isArray(result.lists)) {
    result.lists = result.lists.map((list: any) => cleanResponse(list, "", ""));
  }
  if (result.workspaces && Array.isArray(result.workspaces)) {
    result.workspaces = result.workspaces.map((workspace: any) =>
      cleanResponse(workspace, "", "")
    );
  }

  return result;
};

// Function implementations
const functionImplementations = {
  createCard: async (args: {
    title: string;
    description?: string;
    listId?: string;
    listName?: string;
    boardId?: string;
    inboxUserId?: string;
    position?: number;
    dueDate?: string;
    startDate?: string;
    coverImageUrl?: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
    userId: string;
  }) => {
    try {
      console.log(
        "createCard called with args:",
        JSON.stringify(args, null, 2)
      );

      // Validate required fields
      if (!args.title) {
        return {
          success: false,
          error: "Title is required for creating a card",
        };
      }

      // Validate that either listId or inboxUserId is provided
      if (!args.listId && !args.inboxUserId && !args.listName) {
        return {
          success: false,
          error: "Either listId, listName, or inboxUserId must be provided",
        };
      }

      let targetListId = args.listId;
      let targetInboxUserId = args.inboxUserId;

      // If listName is provided but listId is not, find the list by name
      if (args.listName && !targetListId) {
        if (!args.boardId) {
          return {
            success: false,
            error: `Cannot find list "${args.listName}" without boardId. Please provide boardId or use listId directly.`,
          };
        }

        const lists = await prisma.list.findMany({
          where: {
            boardId: args.boardId,
            name: { contains: args.listName, mode: "insensitive" },
          },
          select: { id: true, name: true },
        });

        if (lists.length === 0) {
          return {
            success: false,
            error: `No list found with name "${args.listName}" in board ${args.boardId}`,
          };
        }

        if (lists.length > 1) {
          return {
            success: false,
            error: `Multiple lists found with name "${args.listName}". Please be more specific.`,
          };
        }

        targetListId = lists[0].id;
        targetInboxUserId = undefined; // Clear inbox if we're using a list
      }

      // If inboxUserId is provided, clear listId
      if (targetInboxUserId) {
        targetListId = undefined;
      }

      // Calculate position if not provided - always append to end
      let calculatedPosition = args.position;
      if (calculatedPosition === undefined) {
        // Get existing cards in the list or inbox to calculate position
        const whereClause = targetListId
          ? { listId: targetListId }
          : { inboxUserId: targetInboxUserId };

        const existingCards = await prisma.card.findMany({
          where: whereClause,
          select: { position: true },
          orderBy: { position: "asc" },
        });

        if (existingCards.length === 0) {
          // First card in the list/inbox - start from 1000
          calculatedPosition = 1000;
        } else {
          // Place at the end (last position + 1000)
          const lastPosition = Number(
            existingCards[existingCards.length - 1].position
          );
          calculatedPosition = lastPosition + 1000;
        }

        console.log(
          `Calculated position: ${calculatedPosition} (${existingCards.length} existing cards)`
        );
      }

      const cardData: CreateCardInput = {
        title: args.title,
        position: calculatedPosition || 1000,
        ...(args.description && { description: args.description }),
        ...(args.dueDate && { dueDate: args.dueDate }),
        ...(args.startDate && { startDate: args.startDate }),
        ...(args.coverImageUrl && { coverImageUrl: args.coverImageUrl }),
        ...(args.location && { location: args.location }),
      };

      console.log(
        "Creating card with data:",
        JSON.stringify(cardData, null, 2)
      );
      console.log("Target list ID:", targetListId);
      console.log("Target inbox user ID:", targetInboxUserId);
      console.log("User ID:", args.userId);

      // Verify user has access if creating in a list
      if (targetListId) {
        const listWithBoard = await prisma.list.findFirst({
          where: {
            id: targetListId,
            board: {
              boardMembers: {
                some: { userId: args.userId },
              },
            },
          },
          include: {
            board: {
              include: {
                boardMembers: {
                  where: { userId: args.userId },
                },
              },
            },
          },
        });

        if (!listWithBoard) {
          console.error(
            "User does not have access to the list or list not found"
          );
          return {
            success: false,
            error:
              "You don't have access to this list or the list doesn't exist",
          };
        }

        console.log(
          "User has access to list:",
          listWithBoard.name,
          "in board:",
          listWithBoard.board.name
        );
      }

      // Verify user has access if creating in inbox
      if (targetInboxUserId && targetInboxUserId !== args.userId) {
        return {
          success: false,
          error: "You can only create cards in your own inbox",
        };
      }

      let card;
      try {
        if (targetListId) {
          card = await cardService.createCard(
            cardData,
            targetListId,
            args.userId
          );
        } else if (targetInboxUserId) {
          card = await cardService.createCard(
            cardData,
            undefined, // listId
            args.userId
          );
        } else {
          return {
            success: false,
            error: "Either listId or inboxUserId must be provided",
          };
        }
      } catch (error) {
        console.error("Error in cardService.createCard:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to create card",
        };
      }

      return { success: true, card };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  updateCard: async (args: {
    cardId: string;
    title?: string;
    description?: string;
    position?: number;
    listId?: string | null;
    inboxUserId?: string | null;
    isCompleted?: boolean;
    isArchived?: boolean;
    dueDate?: string;
    startDate?: string;
    coverImageUrl?: string;
    location?: {
      latitude: number;
      longitude: number;
      address: string;
    };
    userId: string;
  }) => {
    try {
      const updateData: UpdateCardInput = {};
      if (args.title) updateData.title = args.title;
      if (args.description !== undefined)
        updateData.description = args.description;
      if (args.position !== undefined) updateData.position = args.position;
      if (args.isCompleted !== undefined)
        updateData.isCompleted = args.isCompleted;
      if (args.isArchived !== undefined)
        updateData.isArchived = args.isArchived;
      if (args.dueDate !== undefined) updateData.dueDate = args.dueDate;
      if (args.startDate !== undefined) updateData.startDate = args.startDate;
      if (args.coverImageUrl !== undefined)
        updateData.coverImageUrl = args.coverImageUrl;
      if (args.location !== undefined) updateData.location = args.location;

      // Handle list/inbox movement
      if (args.listId !== undefined) {
        updateData.listId = args.listId;
        // Clear inbox when moving to list
        if (args.listId !== null) {
          updateData.inboxUserId = null;
        }
      }

      if (args.inboxUserId !== undefined) {
        updateData.inboxUserId = args.inboxUserId;
        // Clear list when moving to inbox
        if (args.inboxUserId !== null) {
          updateData.listId = null;
        }
      }

      // Auto-calculate position when moving to a new list or inbox
      if (
        (args.listId !== undefined || args.inboxUserId !== undefined) &&
        args.position === undefined
      ) {
        const targetListId = args.listId;
        const targetInboxUserId = args.inboxUserId;

        const whereClause = targetListId
          ? { listId: targetListId }
          : { inboxUserId: targetInboxUserId };

        const existingCards = await prisma.card.findMany({
          where: whereClause,
          select: { position: true },
          orderBy: { position: "asc" },
        });

        if (existingCards.length === 0) {
          // First card in the list/inbox - start from 1000
          updateData.position = 1000;
        } else {
          // Place at the end (last position + 1000)
          const lastPosition = Number(
            existingCards[existingCards.length - 1].position
          );
          updateData.position = lastPosition + 1000;
        }

        console.log(
          `Auto-calculated position for moved card: ${updateData.position} (${existingCards.length} existing cards in target location)`
        );
      }

      const card = await cardService.updateCard(
        args.cardId,
        updateData,
        args.userId
      );
      return { success: true, card };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getCard: async (args: { cardId: string; userId: string }) => {
    try {
      const card = await cardService.getCardById(args.cardId, args.userId);
      return { success: true, card };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  deleteCard: async (args: { cardId: string; userId: string }) => {
    try {
      await cardService.deleteCard(args.cardId, args.userId);
      return { success: true, message: "Card deleted successfully" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  searchCards: async (args: {
    query: string;
    boardId?: string;
    userId: string;
  }) => {
    try {
      // Use Prisma directly since cardService.searchCards doesn't exist
      const cards = await prisma.card.findMany({
        where: {
          title: { contains: args.query, mode: "insensitive" },
          ...(args.boardId && {
            list: {
              boardId: args.boardId,
            },
          }),
          OR: [
            {
              list: {
                board: {
                  boardMembers: {
                    some: { userId: args.userId },
                  },
                },
              },
            },
            {
              inboxUserId: args.userId,
            },
          ],
        },
        include: {
          list: {
            include: {
              board: true,
            },
          },
        },
      });
      return { success: true, cards };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // ==========================
  // BOARD OPERATIONS
  // ==========================
  createBoard: async (args: {
    name: string;
    description?: string;
    workspaceId?: string;
    workspaceName?: string;
    background?: BoardBackground;
    visibility?: BoardVisibility;
    allowCovers?: boolean;
    showComplete?: boolean;
    memberManage?: string;
    commenting?: string;
    userId: string;
  }) => {
    try {
      let targetWorkspaceId = args.workspaceId;

      // If workspaceName is provided but workspaceId is not, find the workspace by name
      if (args.workspaceName && !targetWorkspaceId) {
        const workspaces = await prisma.workspace.findMany({
          where: {
            name: { contains: args.workspaceName, mode: "insensitive" },
            workspaceMembers: {
              some: { userId: args.userId },
            },
          },
          select: { id: true, name: true },
        });

        if (workspaces.length === 0) {
          return {
            success: false,
            error: `No workspace found with name "${args.workspaceName}"`,
          };
        }

        if (workspaces.length > 1) {
          return {
            success: false,
            error: `Multiple workspaces found with name "${args.workspaceName}". Please be more specific.`,
          };
        }

        targetWorkspaceId = workspaces[0].id;
      }

      if (!targetWorkspaceId) {
        return {
          success: false,
          error: "Either workspaceId or workspaceName must be provided",
        };
      }

      const boardData: CreateBoardInput = {
        name: args.name,
        workspaceId: targetWorkspaceId,
        background: args.background || "mountain",
        visibility: args.visibility || "private",
        ...(args.description && { description: args.description }),
        ...(args.allowCovers !== undefined && {
          allowCovers: args.allowCovers,
        }),
        ...(args.showComplete !== undefined && {
          showComplete: args.showComplete,
        }),
        ...(args.memberManage && { memberManage: args.memberManage as any }),
        ...(args.commenting && { commenting: args.commenting as any }),
      };

      const board = await boardService.createBoard(boardData, args.userId);
      return { success: true, board };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  updateBoard: async (args: {
    boardId: string;
    name?: string;
    description?: string;
    background?: BoardBackground;
    visibility?: BoardVisibility;
    allowCovers?: boolean;
    showComplete?: boolean;
    memberManage?: string;
    commenting?: string;
    userId: string;
  }) => {
    try {
      const updateData: UpdateBoardInput = {};
      if (args.name) updateData.name = args.name;
      if (args.description !== undefined)
        updateData.description = args.description;
      if (args.background) updateData.background = args.background;
      if (args.visibility) updateData.visibility = args.visibility;
      if (args.allowCovers !== undefined)
        updateData.allowCovers = args.allowCovers;
      if (args.showComplete !== undefined)
        updateData.showComplete = args.showComplete;
      if (args.memberManage) updateData.memberManage = args.memberManage as any;
      if (args.commenting) updateData.commenting = args.commenting as any;

      const board = await boardService.updateBoard(args.boardId, updateData);
      return { success: true, board };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getBoard: async (args: { boardId: string; userId: string }) => {
    try {
      const board = await boardService.getBoardById(args.boardId, args.userId);
      return { success: true, board };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  deleteBoard: async (args: { boardId: string; userId: string }) => {
    try {
      await boardService.deleteBoard(args.boardId);
      return { success: true, message: "Board deleted successfully" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // ==========================
  // LIST OPERATIONS
  // ==========================
  createList: async (args: {
    name: string;
    boardId?: string;
    boardName?: string;
    position?: number;
    isArchived?: boolean;
    subscribed?: boolean;
    userId: string;
  }) => {
    try {
      let targetBoardId = args.boardId;

      // If boardName is provided but boardId is not, find the board by name
      if (args.boardName && !targetBoardId) {
        const boards = await prisma.board.findMany({
          where: {
            name: { contains: args.boardName, mode: "insensitive" },
            boardMembers: {
              some: { userId: args.userId },
            },
          },
          select: { id: true, name: true },
        });

        if (boards.length === 0) {
          return {
            success: false,
            error: `No board found with name "${args.boardName}"`,
          };
        }

        if (boards.length > 1) {
          return {
            success: false,
            error: `Multiple boards found with name "${args.boardName}". Please be more specific.`,
          };
        }

        targetBoardId = boards[0].id;
      }

      if (!targetBoardId) {
        return {
          success: false,
          error: "Either boardId or boardName must be provided",
        };
      }

      const listData: CreateListInput = {
        name: args.name,
        ...(args.position !== undefined && { position: args.position }),
        ...(args.isArchived !== undefined && { isArchived: args.isArchived }),
        ...(args.subscribed !== undefined && { subscribed: args.subscribed }),
      };

      const list = await listService.createList(listData, targetBoardId);
      return { success: true, list };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  updateList: async (args: {
    listId: string;
    name?: string;
    position?: number;
    isArchived?: boolean;
    subscribed?: boolean;
    userId: string;
  }) => {
    try {
      const updateData: UpdateListInput = {};
      if (args.name) updateData.name = args.name;
      if (args.position !== undefined) updateData.position = args.position;
      if (args.isArchived !== undefined)
        updateData.isArchived = args.isArchived;
      if (args.subscribed !== undefined)
        updateData.subscribed = args.subscribed;

      const list = await listService.updateList(args.listId, updateData);
      return { success: true, list };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getList: async (args: { listId: string; userId: string }) => {
    try {
      const list = await listService.getListById(args.listId, args.userId);
      return { success: true, list };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  deleteList: async (args: { listId: string; userId: string }) => {
    try {
      await listService.deleteList(args.listId);
      return { success: true, message: "List deleted successfully" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getListsByBoard: async (args: { boardId: string; userId: string }) => {
    try {
      const lists = await listService.getListWithCards(args.boardId);
      return { success: true, lists };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // ==========================
  // WORKSPACE OPERATIONS
  // ==========================
  createWorkspace: async (args: {
    name: string;
    description?: string;
    type?: WorkspaceType;
    visibility?: WorkspaceVisibility;
    userId: string;
  }) => {
    try {
      const workspaceData: CreateWorkspaceInput = {
        name: args.name,
        type: args.type || "other",
        ...(args.description && { description: args.description }),
        ...(args.visibility && { visibility: args.visibility }),
      };

      const workspace = await workspaceService.createWorkspace(
        workspaceData,
        args.userId
      );
      return { success: true, workspace };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  updateWorkspace: async (args: {
    workspaceId: string;
    name?: string;
    description?: string;
    type?: WorkspaceType;
    visibility?: WorkspaceVisibility;
    userId: string;
  }) => {
    try {
      const updateData: UpdateWorkspaceInput = {};
      if (args.name) updateData.name = args.name;
      if (args.description !== undefined)
        updateData.description = args.description;
      if (args.type) updateData.type = args.type;
      if (args.visibility) updateData.visibility = args.visibility;

      const workspace = await workspaceService.updateWorkspace(
        args.workspaceId,
        updateData
      );
      return { success: true, workspace };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getWorkspace: async (args: { workspaceId: string; userId: string }) => {
    try {
      const workspace = await workspaceService.getWorkspaceById(
        args.workspaceId,
        args.userId
      );
      return { success: true, workspace };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  deleteWorkspace: async (args: { workspaceId: string; userId: string }) => {
    try {
      await workspaceService.deleteWorkspace(args.workspaceId);
      return { success: true, message: "Workspace deleted successfully" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getWorkspaces: async (args: { userId: string }) => {
    try {
      const workspaces = await workspaceService.getWorkspacesByUser(
        args.userId
      );
      return { success: true, workspaces };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  createMultipleCards: async (args: {
    cards: Array<{
      title: string;
      description?: string;
      listId: string;
      position?: number;
    }>;
    boardId?: string;
    userId: string;
  }) => {
    try {
      const results = [];

      for (const cardData of args.cards) {
        // Calculate position if not provided
        let calculatedPosition = cardData.position;
        if (calculatedPosition === undefined) {
          const existingCards = await prisma.card.findMany({
            where: { listId: cardData.listId },
            select: { position: true },
            orderBy: { position: "asc" },
          });

          if (existingCards.length === 0) {
            calculatedPosition = 1000;
          } else {
            const lastPosition = Number(
              existingCards[existingCards.length - 1].position
            );
            calculatedPosition = lastPosition + 1000;
          }
        }

        const createData: CreateCardInput = {
          title: cardData.title,
          position: calculatedPosition,
          ...(cardData.description && { description: cardData.description }),
        };

        try {
          const card = await cardService.createCard(
            createData,
            cardData.listId,
            args.userId
          );
          results.push({ success: true, card });
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            cardData,
          });
        }
      }

      return { success: true, results };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

export class AIService {
  static async processMessage(
    message: string,
    userId: string,
    boardId?: string
  ): Promise<{ response: string; functionCalls?: any[] }> {
    try {
      // Get user's workspaces and boards for context
      const userWorkspaces = await prisma.workspace.findMany({
        where: {
          workspaceMembers: {
            some: { userId },
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: { boards: true },
          },
        },
      });

      const userBoards = await prisma.board.findMany({
        where: {
          boardMembers: {
            some: { userId },
          },
        },
        select: {
          id: true,
          name: true,
          lists: {
            select: {
              id: true,
              name: true,
              _count: {
                select: { cards: true },
              },
            },
          },
        },
      });

      const workspaceContext = userWorkspaces
        .map(
          (workspace) =>
            `Workspace: ${workspace.name} (ID: ${workspace.id}, ${workspace._count.boards} boards)`
        )
        .join("\n");

      const boardContext = userBoards
        .map(
          (board) =>
            `Board: ${board.name} (ID: ${board.id}) - Lists: ${board.lists
              .map(
                (list) =>
                  `${list.name} (ID: ${list.id}, ${list._count.cards} cards)`
              )
              .join(", ")}`
        )
        .join("\n");

      const systemPrompt = `You are an AI assistant for a Trello-like project management application. 
You can help users manage their workspaces, boards, lists, and cards by calling specific functions.

Available workspaces for this user:
${workspaceContext}

Available boards for this user:
${boardContext}

Current board context: ${
        boardId
          ? `Working with board ID: ${boardId}`
          : "No specific board selected"
      }

You can perform the following actions:

CARDS:
- Create, read, update, and delete cards
- Cards can belong to lists (listId) or user inbox (inboxUserId) - one must be provided
- Move cards between lists and inbox by setting listId/inboxUserId
- Update card position, status (completed/archived), dates, cover image, location
- Search for cards by title or description
- When moving cards without specifying position, they are automatically appended to the end

BOARDS:
- Create, read, update, and delete boards
- Set board background, visibility, permissions, and settings
- Create boards in workspaces by name or ID

LISTS:
- Create, read, update, and delete lists
- Set list position, archive status, and subscription
- Create lists in boards by name or ID

WORKSPACES:
- Create, read, update, and delete workspaces
- Set workspace type, visibility, and description
- Get all user's workspaces

IMPORTANT: Cards can be in either a list OR inbox, never both. When moving between them:
- To move to inbox: set listId to null and inboxUserId to userId
- To move to list: set inboxUserId to null and listId to target list ID

IMPORTANT: When a task requires multiple steps (like "set card X to completed"), you must:
1. First search for the card to get its ID using searchCards
2. Then update the card with the new status using updateCard with isCompleted: true
3. Continue until the task is fully completed

CRITICAL: After finding a card with searchCards, you MUST call updateCard to actually modify the card. Do not just say you will do it - actually call the updateCard function with the card ID and the required changes.

EFFICIENCY TIPS:
- For creating multiple cards, use createMultipleCards instead of multiple createCard calls
- Batch similar operations together when possible
- Use the most specific function available for your task

Always be helpful and provide clear responses. When you perform actions, explain what you did.

CRITICAL: Never display internal IDs (like cardId, listId, boardId, workspaceId) in your responses to users. Use friendly names instead. For example:
- Instead of "Created card with ID abc123" say "Created card 'Task Name'"
- Instead of "Updated list def456" say "Updated list 'To Do'"
- Instead of "Moved to board ghi789" say "Moved to board 'Project Board'"
- Instead of "Card ID: xyz789" say "Card 'Task Name'"
- Instead of "List ID: abc123" say "List 'To Do'"

When reporting results, focus on:
- What was created/updated/deleted (by name)
- Where it was placed (by name)
- What the outcome was
- Never mention IDs, UUIDs, or technical identifiers

Focus on what was accomplished, not the technical details.`;

      console.log(
        "Available functions for AI:",
        JSON.stringify(availableFunctions, null, 2)
      );

      let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ];

      let functionCalls: any[] = [];
      let iterations = 0;
      const maxIterations = 10; // Increased to allow more complex operations

      while (iterations < maxIterations) {
        iterations++;
        console.log(`\n=== AI Iteration ${iterations} ===`);

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          tools: Object.values(availableFunctions).map((func) => ({
            type: "function" as const,
            function: func,
          })),
          tool_choice: "auto",
          temperature: 0.7,
        });

        const responseMessage = completion.choices[0].message;

        // If AI wants to call tools
        if (
          responseMessage.tool_calls &&
          responseMessage.tool_calls.length > 0
        ) {
          console.log(
            `AI wants to make ${responseMessage.tool_calls.length} tool calls`
          );

          // Add assistant message with tool calls
          messages.push({
            role: "assistant",
            content: responseMessage.content || "",
            tool_calls: responseMessage.tool_calls,
          });

          // Process all tool calls
          for (const toolCall of responseMessage.tool_calls) {
            if (toolCall.type === "function") {
              const functionName = toolCall.function.name;
              const functionArgs = JSON.parse(toolCall.function.arguments);

              console.log(`Processing function call: ${functionName}`);
              console.log(
                "Original function args:",
                JSON.stringify(functionArgs, null, 2)
              );
              console.log("Available boardId:", boardId);

              // Add boardId to function calls if not provided and we have a current board
              if (
                boardId &&
                !functionArgs.boardId &&
                [
                  "createCard",
                  "searchCards",
                  "createList",
                  "getListsByBoard",
                ].includes(functionName)
              ) {
                console.log(
                  `Auto-assigning boardId ${boardId} to function ${functionName}`
                );
                functionArgs.boardId = boardId;
              }

              // Add userId to all function calls
              functionArgs.userId = userId;

              console.log(
                "Final function args after auto-assignment:",
                JSON.stringify(functionArgs, null, 2)
              );

              const functionResult = await (functionImplementations as any)[
                functionName
              ](functionArgs);

              // Clean the function result to hide internal IDs
              const cleanedResult = cleanFunctionResult(functionResult);

              functionCalls.push({
                name: functionName,
                arguments: functionArgs,
                result: cleanedResult,
              });

              // Add tool result to messages
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(functionResult),
              });
            }
          }

          continue; // Let AI decide next step (maybe another tool call)
        }

        // No more tool calls → done
        console.log("AI is done with tool calls");
        return {
          response: responseMessage.content || "Action completed successfully.",
          functionCalls,
        };
      }

      // Reached max iterations
      console.log("Reached maximum iterations, stopping");
      return {
        response: "Action completed (reached maximum iterations).",
        functionCalls,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        response:
          "Sorry, I encountered an error while processing your request. Please try again.",
      };
    }
  }

  static getAvailableFunctions() {
    return availableFunctions;
  }
}
