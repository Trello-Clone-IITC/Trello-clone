import * as schemas from "@ronmordo/contracts";
import { createDocument } from "zod-openapi";
import { z, ZodType } from "zod";

const zodSchemas: Record<string, ZodType> = {};
for (const [key, value] of Object.entries(schemas)) {
  if (value instanceof z.ZodType) {
    zodSchemas[key] = value;
  }
}

export const openApiDoc = createDocument({
  openapi: "3.0.0",
  info: {
    title: "Trello Clone API",
    version: "1.0.0",
    description:
      "A comprehensive API for managing workspaces, boards, lists, cards, and all related resources in a Trello-like application.",
  },
  servers: [{ url: "http://localhost:3000/api" }],
  components: {
    schemas: zodSchemas,
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    // ==========================
    // AUTH ENDPOINTS
    // ==========================
    "/auth/checkEmail": {
      get: {
        tags: ["Authentication"],
        summary: "Check if email exists",
        parameters: [
          {
            name: "email",
            in: "query",
            required: true,
            schema: { type: "string", format: "email" },
          },
        ],
        responses: {
          "200": {
            description: "Email check result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { exists: { type: "boolean" } },
                },
              },
            },
          },
        },
      },
    },
    "/auth/onboarding": {
      post: {
        tags: ["Authentication"],
        summary: "Complete user onboarding",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateOnBoardingInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Onboarding completed",
            content: {
              "application/json": {
                schema: zodSchemas.UserDtoSchema as any,
              },
            },
          },
        },
      },
    },

    // ==========================
    // USER ENDPOINTS
    // ==========================
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile",
            content: {
              "application/json": {
                schema: zodSchemas.UserDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/users/me/workspaces": {
      get: {
        tags: ["Users"],
        summary: "Get all workspaces for current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User workspaces",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.WorkspaceDtoSchema as any,
                },
              },
            },
          },
        },
      },
    },

    // ==========================
    // WORKSPACE ENDPOINTS
    // ==========================
    "/workspaces": {
      get: {
        tags: ["Workspaces"],
        summary: "Get all workspaces",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of workspaces",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.WorkspaceDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Workspaces"],
        summary: "Create a new workspace",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateWorkspaceInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Workspace created",
            content: {
              "application/json": {
                schema: zodSchemas.WorkspaceDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/workspaces/search": {
      get: {
        tags: ["Workspaces"],
        summary: "Search workspaces",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.WorkspaceDtoSchema as any,
                },
              },
            },
          },
        },
      },
    },
    "/workspaces/{id}": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspace by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Workspace details",
            content: {
              "application/json": {
                schema: zodSchemas.WorkspaceDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Workspaces"],
        summary: "Update workspace",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateWorkspaceSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Workspace updated",
            content: {
              "application/json": {
                schema: zodSchemas.WorkspaceDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Workspaces"],
        summary: "Delete workspace",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Workspace deleted" },
        },
      },
    },
    "/workspaces/{id}/boards": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspace boards",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Workspace boards",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.BoardDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Workspaces"],
        summary: "Create a new board in workspace",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateBoardInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Board created",
            content: {
              "application/json": {
                schema: zodSchemas.BoardDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/workspaces/{id}/members": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspace members",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Workspace members",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.WorkspaceMemberDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Workspaces"],
        summary: "Add workspace member",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateWorkspaceMemberInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Member added",
            content: {
              "application/json": {
                schema: zodSchemas.WorkspaceMemberDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/workspaces/{id}/members/{userId}": {
      patch: {
        tags: ["Workspaces"],
        summary: "Update workspace member role",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateWorkspaceMemberSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Member role updated",
            content: {
              "application/json": {
                schema: zodSchemas.WorkspaceMemberDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Workspaces"],
        summary: "Remove workspace member",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Member removed" },
        },
      },
    },

    // ==========================
    // BOARD ENDPOINTS
    // ==========================
    "/boards/{id}": {
      get: {
        tags: ["Boards"],
        summary: "Get board by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Board details",
            content: {
              "application/json": {
                schema: zodSchemas.BoardDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Boards"],
        summary: "Update board",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateBoardSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Board updated",
            content: {
              "application/json": {
                schema: zodSchemas.BoardDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Boards"],
        summary: "Delete board",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Board deleted" },
        },
      },
    },
    "/boards/{id}/full": {
      get: {
        tags: ["Boards"],
        summary: "Get full board with all nested data",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Full board details",
            content: {
              "application/json": {
                schema: zodSchemas.BoardFullDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/boards/{id}/boardMembers": {
      get: {
        tags: ["Boards"],
        summary: "Get board members",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Board members",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.BoardMemberDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Boards"],
        summary: "Add board member",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateBoardMemberInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Member added",
            content: {
              "application/json": {
                schema: zodSchemas.BoardMemberDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/boards/{id}/boardMembers/{userId}": {
      patch: {
        tags: ["Boards"],
        summary: "Update board member role",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateBoardMemberSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Member role updated",
            content: {
              "application/json": {
                schema: zodSchemas.BoardMemberDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Boards"],
        summary: "Remove board member",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Member removed" },
        },
      },
    },
    "/boards/{id}/lists": {
      get: {
        tags: ["Boards"],
        summary: "Get board lists",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Board lists",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.ListDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Boards"],
        summary: "Create a new list in board",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateListInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "List created",
            content: {
              "application/json": {
                schema: zodSchemas.ListDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/boards/{id}/labels": {
      get: {
        tags: ["Boards"],
        summary: "Get board labels",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Board labels",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.LabelDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Boards"],
        summary: "Create a new label in board",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateLabelInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Label created",
            content: {
              "application/json": {
                schema: zodSchemas.LabelDtoSchema as any,
              },
            },
          },
        },
      },
    },

    // ==========================
    // LIST ENDPOINTS
    // ==========================
    "/lists/{listId}": {
      get: {
        tags: ["Lists"],
        summary: "Get list by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "List details",
            content: {
              "application/json": {
                schema: zodSchemas.ListDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Lists"],
        summary: "Update list",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateListSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "List updated",
            content: {
              "application/json": {
                schema: zodSchemas.ListDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Lists"],
        summary: "Delete list",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "List deleted" },
        },
      },
    },
    "/lists/{listId}/watchers": {
      get: {
        tags: ["Lists"],
        summary: "Get list watchers",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "List watchers",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.ListWatcherDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Lists"],
        summary: "Add list watcher",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "201": {
            description: "Watcher added",
            content: {
              "application/json": {
                schema: zodSchemas.ListWatcherDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/lists/{listId}/watchers/{userId}": {
      delete: {
        tags: ["Lists"],
        summary: "Remove list watcher",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Watcher removed" },
        },
      },
    },
    "/lists/{listId}/cards": {
      get: {
        tags: ["Lists"],
        summary: "Get cards in list",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "List cards",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.CardDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Lists"],
        summary: "Create a new card in list",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "listId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateCardInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Card created",
            content: {
              "application/json": {
                schema: zodSchemas.CardDtoSchema as any,
              },
            },
          },
        },
      },
    },

    // ==========================
    // CARD ENDPOINTS
    // ==========================
    "/cards/{id}": {
      get: {
        tags: ["Cards"],
        summary: "Get card by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Card details",
            content: {
              "application/json": {
                schema: zodSchemas.CardDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Cards"],
        summary: "Update card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateCardSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Card updated",
            content: {
              "application/json": {
                schema: zodSchemas.CardDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Cards"],
        summary: "Delete card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Card deleted" },
        },
      },
    },
    "/cards/{cardId}/checklists": {
      get: {
        tags: ["Cards"],
        summary: "Get card checklists",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Card checklists",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.ChecklistDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cards"],
        summary: "Create a new checklist in card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateChecklistInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Checklist created",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{cardId}/labels": {
      get: {
        tags: ["Cards"],
        summary: "Get card labels",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Card labels",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.CardLabelDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cards"],
        summary: "Add label to card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateCardLabelInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Label added to card",
            content: {
              "application/json": {
                schema: zodSchemas.CardLabelDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{cardId}/labels/{labelId}": {
      delete: {
        tags: ["Cards"],
        summary: "Remove label from card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "labelId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Label removed from card" },
        },
      },
    },
    "/cards/{id}/comments": {
      get: {
        tags: ["Cards"],
        summary: "Get card comments",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Card comments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.CommentDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cards"],
        summary: "Create a new comment on card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateCommentInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created",
            content: {
              "application/json": {
                schema: zodSchemas.CommentDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{cardId}/attachments": {
      get: {
        tags: ["Cards"],
        summary: "Get card attachments",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Card attachments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.AttachmentDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cards"],
        summary: "Create a new attachment on card",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateAttachmentInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Attachment created",
            content: {
              "application/json": {
                schema: zodSchemas.AttachmentDtoSchema as any,
              },
            },
          },
        },
      },
    },

    // ==========================
    // CHECKLIST ENDPOINTS
    // ==========================
    "/cards/{cardId}/checklists/{id}": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Checklist details",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Checklists"],
        summary: "Update checklist",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateChecklistSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Checklist updated",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Checklists"],
        summary: "Delete checklist",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Checklist deleted" },
        },
      },
    },
    "/cards/{cardId}/checklists/{checklistId}/checklistItems": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist items",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "checklistId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Checklist items",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.ChecklistItemDtoSchema as any,
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Checklists"],
        summary: "Create a new checklist item",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "checklistId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.CreateChecklistItemInputSchema as any,
            },
          },
        },
        responses: {
          "201": {
            description: "Checklist item created",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistItemDtoSchema as any,
              },
            },
          },
        },
      },
    },

    // ==========================
    // CHECKLIST ITEM ENDPOINTS
    // ==========================
    "/cards/{cardId}/checklists/{checklistId}/checklistItems/{id}": {
      get: {
        tags: ["Checklist Items"],
        summary: "Get checklist item by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "checklistId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Checklist item details",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistItemDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Checklist Items"],
        summary: "Update checklist item",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "checklistId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateChecklistItemSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Checklist item updated",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistItemDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Checklist Items"],
        summary: "Delete checklist item",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "checklistId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Checklist item deleted" },
        },
      },
    },
    "/cards/{cardId}/checklists/{checklistId}/checklistItems/{itemId}/checklistItemAssignees":
      {
        get: {
          tags: ["Checklist Item Assignees"],
          summary: "Get checklist item assignees",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "cardId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "checklistId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "200": {
              description: "Checklist item assignees",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: zodSchemas.ChecklistItemAssigneeDtoSchema as any,
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Checklist Item Assignees"],
          summary: "Assign user to checklist item",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "cardId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "checklistId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userId: { type: "string", format: "uuid" },
                  },
                  required: ["userId"],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "User assigned to item",
              content: {
                "application/json": {
                  schema: zodSchemas.ChecklistItemAssigneeDtoSchema as any,
                },
              },
            },
          },
        },
      },
    "/cards/{cardId}/checklists/{checklistId}/checklistItems/{itemId}/checklistItemAssignees/{userId}":
      {
        delete: {
          tags: ["Checklist Item Assignees"],
          summary: "Remove user from checklist item",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "cardId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "checklistId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            "204": { description: "User removed from item" },
          },
        },
      },

    "/cards/{cardId}/attachments/{id}": {
      get: {
        tags: ["Attachments"],
        summary: "Get attachment by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Attachment details",
            content: {
              "application/json": {
                schema: zodSchemas.AttachmentDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Attachments"],
        summary: "Update attachment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateAttachmentSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Attachment updated",
            content: {
              "application/json": {
                schema: zodSchemas.AttachmentDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Attachments"],
        summary: "Delete attachment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "cardId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Attachment deleted" },
        },
      },
    },

    // ==========================
    // COMMENT ENDPOINTS
    // ==========================
    "/comments/{id}": {
      get: {
        tags: ["Comments"],
        summary: "Get comment by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Comment details",
            content: {
              "application/json": {
                schema: zodSchemas.CommentDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Comments"],
        summary: "Update comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateCommentSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Comment updated",
            content: {
              "application/json": {
                schema: zodSchemas.CommentDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Comment deleted" },
        },
      },
    },

    // ==========================
    // LABEL ENDPOINTS
    // ==========================
    "/labels/{labelId}": {
      get: {
        tags: ["Labels"],
        summary: "Get label by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "labelId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Label details",
            content: {
              "application/json": {
                schema: zodSchemas.LabelDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Labels"],
        summary: "Update label",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "labelId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: zodSchemas.UpdateLabelSchema as any,
            },
          },
        },
        responses: {
          "200": {
            description: "Label updated",
            content: {
              "application/json": {
                schema: zodSchemas.LabelDtoSchema as any,
              },
            },
          },
        },
      },
      delete: {
        tags: ["Labels"],
        summary: "Delete label",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "labelId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Label deleted" },
        },
      },
    },
  },
});
