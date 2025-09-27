import OpenAI from "openai";
import { prisma } from "../../lib/prismaClient.js";
import boardService from "../boards/board.service.js";
import type {
  UpdateCardInput,
  CreateBoardInput,
  CreateWorkspaceInput,
} from "@ronmordo/contracts";
import cardService from "../cards/card.service.js";
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
  createCard: {
    name: "createCard",
    description:
      "Create a new card in a specific list. You can provide either listId or listName. If you provide listName, the AI will find the list ID automatically.",
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
            "The ID of the list where the card should be created (optional if listName is provided)",
        },
        listName: {
          type: "string",
          description:
            "The name of the list where the card should be created (optional if listId is provided)",
        },
        boardId: {
          type: "string",
          description: "The ID of the board containing the list",
        },
        position: {
          type: "number",
          description:
            "The position of the card in the list (optional, defaults to 0)",
        },
      },
      required: ["title"],
    },
  },
  updateCard: {
    name: "updateCard",
    description: "Update an existing card",
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
        isCompleted: {
          type: "boolean",
          description: "Whether the card is completed (optional)",
        },
        isArchived: {
          type: "boolean",
          description: "Whether the card is archived (optional)",
        },
      },
      required: ["cardId"],
    },
  },
  moveCard: {
    name: "moveCard",
    description: "Move a card from one list to another",
    parameters: {
      type: "object",
      properties: {
        cardId: {
          type: "string",
          description: "The ID of the card to move",
        },
        targetListId: {
          type: "string",
          description: "The ID of the target list",
        },
        position: {
          type: "number",
          description: "The position in the target list (optional)",
        },
      },
      required: ["cardId", "targetListId"],
    },
  },
  createList: {
    name: "createList",
    description:
      "Create a new list in a board. You can provide either boardId or boardName. If you provide boardName, the AI will find the board ID automatically.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the list",
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
      },
      required: ["title"],
    },
  },
  getBoardInfo: {
    name: "getBoardInfo",
    description: "Get information about a board including its lists and cards",
    parameters: {
      type: "object",
      properties: {
        boardId: {
          type: "string",
          description: "The ID of the board to get information about",
        },
      },
      required: ["boardId"],
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
  getListsByBoard: {
    name: "getListsByBoard",
    description: "Get all lists in a board to find list IDs by name",
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
  createBoard: {
    name: "createBoard",
    description:
      "Create a new board in a workspace. You can provide either workspaceId or workspaceName. If you provide workspaceName, the AI will find the workspace ID automatically.",
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
      },
      required: ["name"],
    },
  },
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
      },
      required: ["name"],
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
};

// Function implementations
const functionImplementations = {
  createCard: async (args: {
    title: string;
    description?: string;
    listId?: string;
    listName?: string;
    boardId?: string;
    position?: number;
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

      let targetListId = args.listId;

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
      }

      if (!targetListId) {
        return {
          success: false,
          error: "Either listId or listName must be provided",
        };
      }

      // Calculate position if not provided - always append to end
      let calculatedPosition = args.position;
      if (calculatedPosition === undefined) {
        // Get existing cards in the list to calculate position
        const existingCards = await prisma.card.findMany({
          where: { listId: targetListId },
          select: { position: true },
          orderBy: { position: "asc" },
        });

        if (existingCards.length === 0) {
          // First card in the list - start from 1000
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

      const cardData = {
        title: args.title,
        position: calculatedPosition || 0, // Ensure position is always a number
        // Note: location field is not supported in the database schema
      };

      console.log(
        "Creating card with data:",
        JSON.stringify(cardData, null, 2)
      );
      console.log("Target list ID:", targetListId);
      console.log("User ID:", args.userId);

      // Verify user has access to the list/board
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
          error: "You don't have access to this list or the list doesn't exist",
        };
      }

      console.log(
        "User has access to list:",
        listWithBoard.name,
        "in board:",
        listWithBoard.board.name
      );

      let card;
      try {
        card = await cardService.createCard(
          cardData,
          targetListId,
          args.userId
        );
      } catch (error) {
        console.error("Error in cardService.createCard:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to create card",
        };
      }

      if (args.description) {
        const updatedCard = await cardService.updateCard(
          card.id,
          { description: args.description },
          args.userId
        );
        return { success: true, card: updatedCard };
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
    isCompleted?: boolean;
    isArchived?: boolean;
    userId: string;
  }) => {
    try {
      const updateData: UpdateCardInput = {};
      if (args.title) updateData.title = args.title;
      if (args.description !== undefined)
        updateData.description = args.description;
      if (args.isCompleted !== undefined)
        updateData.isCompleted = args.isCompleted;
      if (args.isArchived !== undefined)
        updateData.isArchived = args.isArchived;

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

  moveCard: async (args: {
    cardId: string;
    targetListId: string;
    position?: number;
    userId: string;
  }) => {
    try {
      const updateData: UpdateCardInput = {
        listId: args.targetListId,
        position: args.position,
      };
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

  createList: async (args: {
    title: string;
    boardId?: string;
    boardName?: string;
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
            error: `No board found with name "${args.boardName}" that you have access to`,
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

      const list = await listService.createList(
        { name: args.title },
        targetBoardId
      );
      return { success: true, list };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getBoardInfo: async (args: { boardId: string; userId: string }) => {
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

  searchCards: async (args: {
    query: string;
    boardId?: string;
    userId: string;
  }) => {
    try {
      const whereClause: any = {
        OR: [
          { title: { contains: args.query, mode: "insensitive" } },
          { description: { contains: args.query, mode: "insensitive" } },
        ],
      };

      if (args.boardId) {
        whereClause.list = { boardId: args.boardId };
      }

      const cards = await prisma.card.findMany({
        where: whereClause,
        include: {
          list: {
            include: {
              board: true,
            },
          },
        },
        take: 10, // Limit results
      });
      return { success: true, cards };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  getListsByBoard: async (args: { boardId: string; userId: string }) => {
    try {
      const lists = await prisma.list.findMany({
        where: { boardId: args.boardId },
        select: {
          id: true,
          name: true,
          position: true,
          _count: {
            select: {
              cards: true,
            },
          },
        },
        orderBy: { position: "asc" },
      });
      return { success: true, lists };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  createBoard: async (args: {
    name: string;
    description?: string;
    workspaceId?: string;
    workspaceName?: string;
    background?: string;
    visibility?: string;
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
            error: `No workspace found with name "${args.workspaceName}" that you have access to`,
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
        background: (args.background as any) || "mountain",
        visibility: (args.visibility as any) || "private",
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

  createWorkspace: async (args: {
    name: string;
    description?: string;
    type?: string;
    visibility?: string;
    userId: string;
  }) => {
    try {
      const workspaceData: CreateWorkspaceInput = {
        name: args.name,
        description: args.description,
        type: (args.type as any) || "other",
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

  getWorkspaces: async (args: { userId: string }) => {
    try {
      const workspaces = await prisma.workspace.findMany({
        where: {
          workspaceMembers: {
            some: { userId: args.userId },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          visibility: true,
          _count: {
            select: {
              boards: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return { success: true, workspaces };
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
      // Get user's accessible boards for context
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          boardMembers: {
            include: {
              board: {
                include: {
                  lists: {
                    include: {
                      cards: {
                        orderBy: { position: "asc" },
                      },
                    },
                    orderBy: { position: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Build context about user's boards and workspaces
      const boardContext = user.boardMembers
        .map((member) => {
          const board = member.board;
          const listsInfo = board.lists
            .map(
              (list) =>
                `${list.name} (ID: ${list.id}, ${list.cards.length} cards)`
            )
            .join(", ");
          return `Board: ${board.name} (ID: ${board.id}) - Lists: ${listsInfo}`;
        })
        .join("\n");

      // Get user's workspaces for context
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
            select: {
              boards: true,
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
- Create, update, and move cards
- Create new lists in boards
- Create new boards in workspaces
- Create new workspaces
- Get board information
- Get workspace information
- Search for cards
- Get lists in a board (to find list IDs by name)

IMPORTANT: When creating resources, you can use either IDs or names:
1. createCard: Use listId OR listName (AI will find the list ID automatically). Position is optional with default.
2. createList: Use boardId OR boardName (AI will find the board ID automatically). Position is automatically calculated.
3. createBoard: Use workspaceId OR workspaceName (AI will find the workspace ID automatically). Background and visibility have defaults.
4. createWorkspace: Just provide the name (no parent needed)

The AI will automatically resolve names to IDs when possible and provide sensible defaults for optional parameters, making it much easier to work with natural language.

IMPORTANT: When a task requires multiple steps (like "set card X to completed"), you must:
1. First search for the card to get its ID using searchCards
2. Then update the card with the new status using updateCard with isCompleted: true
3. Continue until the task is fully completed

CRITICAL: After finding a card with searchCards, you MUST call updateCard to actually modify the card. Do not just say you will do it - actually call the updateCard function with the card ID and the required changes.

Always be helpful and provide clear responses. When you perform actions, explain what you did.`;

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ];

      console.log(
        "Available functions for AI:",
        JSON.stringify(availableFunctions, null, 2)
      );

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

      let responseMessage = completion.choices[0].message;
      const functionCalls: any[] = [];

      // Handle tool calls - process all tool calls in the response
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        console.log(`Processing ${responseMessage.tool_calls.length} tool calls`);
        let currentMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ];

        let hasMoreToolCalls = true;
        let iterationCount = 0;
        const maxIterations = 5; // Prevent infinite loops

        while (hasMoreToolCalls && iterationCount < maxIterations) {
          iterationCount++;
          console.log(`\n=== Tool Call Iteration ${iterationCount} ===`);

          // Add the assistant's message with tool calls first
          currentMessages.push({
            role: "assistant",
            content: responseMessage.content || "",
            tool_calls: responseMessage.tool_calls,
          });

          // Process all tool calls in the current response
          if (responseMessage.tool_calls) {
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
                    "createList",
                    "searchCards",
                    "getListsByBoard",
                    "getBoardInfo",
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
                functionCalls.push({
                  name: functionName,
                  arguments: functionArgs,
                  result: functionResult,
                });

                // Add tool call result to messages (must come after assistant message with tool_calls)
                currentMessages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify(functionResult),
                });
              }
            }
          }

          // Get the next response from the AI
          console.log(
            "Sending messages to AI:",
            JSON.stringify(
              currentMessages.map((m) => ({
                role: m.role,
                content: m.content,
                tool_calls: "tool_calls" in m ? m.tool_calls : undefined,
              })),
              null,
              2
            )
          );

          const nextCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: currentMessages,
            temperature: 0.7,
          });

          responseMessage = nextCompletion.choices[0].message;
          console.log(
            "AI response:",
            JSON.stringify(
              {
                content: responseMessage.content,
                tool_calls: responseMessage.tool_calls?.map((tc) => ({
                  name: tc.type === "function" ? tc.function.name : "unknown",
                  arguments:
                    tc.type === "function" ? tc.function.arguments : "unknown",
                })),
              },
              null,
              2
            )
          );

          hasMoreToolCalls = !!(
            responseMessage.tool_calls && responseMessage.tool_calls.length > 0
          );

          if (hasMoreToolCalls) {
            console.log(
              `AI wants to make ${
                responseMessage.tool_calls?.length || 0
              } more tool calls`
            );
          } else {
            console.log("AI is done with tool calls");

            // Check if the task might be incomplete
            const lastUserMessage = message.toLowerCase();
            const lastAIResponse = responseMessage.content?.toLowerCase() || "";

            // If user asked to set a card to completed but AI didn't call updateCard
            if (
              lastUserMessage.includes("completed") &&
              lastUserMessage.includes("card") &&
              !lastAIResponse.includes("successfully") &&
              !lastAIResponse.includes("completed") &&
              functionCalls.some((call) => call.name === "searchCards") &&
              !functionCalls.some((call) => call.name === "updateCard")
            ) {
              console.log(
                "Detected incomplete task - forcing AI to continue with updateCard"
              );

              // Force the AI to make an updateCard call
              const searchResult = functionCalls.find(
                (call) => call.name === "searchCards"
              );
              if (
                searchResult &&
                searchResult.result.success &&
                searchResult.result.cards.length > 0
              ) {
                const card = searchResult.result.cards[0];

                // Add a follow-up message to force the AI to complete the task
                currentMessages.push({
                  role: "user",
                  content: `You found the card "${card.title}" with ID "${card.id}". Now you MUST call updateCard with cardId: "${card.id}" and isCompleted: true to actually complete the task. Do not just say you will do it - actually call the function.`,
                });

                // Get another response from the AI
                const forcedCompletion = await openai.chat.completions.create({
                  model: "gpt-4o-mini",
                  messages: currentMessages,
                  temperature: 0.7,
                });

                responseMessage = forcedCompletion.choices[0].message;
                hasMoreToolCalls = !!(
                  responseMessage.tool_calls &&
                  responseMessage.tool_calls.length > 0
                );

                if (hasMoreToolCalls) {
                  console.log(
                    "AI now wants to make tool calls after being forced"
                  );
                } else {
                  console.log(
                    "AI still not making tool calls after being forced"
                  );
                }
              }
            }
          }
        }

        if (iterationCount >= maxIterations) {
          console.log(
            "Reached maximum iterations, stopping tool call execution"
          );
        }

        return {
          response: responseMessage.content || "Action completed successfully.",
          functionCalls,
        };
      }

      return {
        response: responseMessage.content || "I understand your request.",
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
