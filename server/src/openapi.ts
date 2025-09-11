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

    // ==========================
    // WORKSPACE ENDPOINTS
    // ==========================
    "/workspaces": {
      get: {
        tags: ["Workspaces"],
        summary: "Get all workspaces",
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
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100 },
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
    "/workspaces/user/{userId}": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspaces by user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
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
    "/workspaces/creator/{userId}": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspaces created by user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Created workspaces",
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
              schema: zodSchemas.WorkspaceDtoSchema as any,
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
    },
    "/workspaces/{id}/members": {
      get: {
        tags: ["Workspaces"],
        summary: "Get workspace members",
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
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string", format: "uuid" },
                  role: zodSchemas.WorkspaceRoleSchema as any,
                },
                required: ["userId", "role"],
              },
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
              schema: {
                type: "object",
                properties: {
                  role: zodSchemas.WorkspaceRoleSchema as any,
                },
                required: ["role"],
              },
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
    "/boards": {
      get: {
        tags: ["Boards"],
        summary: "Get all boards",
        responses: {
          "200": {
            description: "List of boards",
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
        tags: ["Boards"],
        summary: "Create a new board",
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
    "/boards/user/{userId}": {
      get: {
        tags: ["Boards"],
        summary: "Get boards by user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "User boards",
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
    },
    "/boards/{id}": {
      get: {
        tags: ["Boards"],
        summary: "Get board by ID",
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
                schema: zodSchemas.BoardFullDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Boards"],
        summary: "Update board",
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
              schema: zodSchemas.BoardDtoSchema as any,
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
    "/boards/{id}/members": {
      get: {
        tags: ["Boards"],
        summary: "Get board members",
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
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string", format: "uuid" },
                  role: zodSchemas.BoardRoleSchema as any,
                },
                required: ["userId", "role"],
              },
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
    "/boards/{id}/members/{userId}": {
      patch: {
        tags: ["Boards"],
        summary: "Update board member role",
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
              schema: {
                type: "object",
                properties: {
                  role: zodSchemas.BoardRoleSchema as any,
                },
                required: ["role"],
              },
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
    },
    "/boards/{id}/labels": {
      get: {
        tags: ["Boards"],
        summary: "Get board labels",
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
    },
    "/boards/{id}/activity-logs": {
      get: {
        tags: ["Boards"],
        summary: "Get board activity logs",
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
            description: "Board activity logs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.ActivityLogDtoSchema as any,
                },
              },
            },
          },
        },
      },
    },

    // ==========================
    // LIST ENDPOINTS
    // ==========================
    "/lists/board/{boardId}": {
      post: {
        tags: ["Lists"],
        summary: "Create a new list",
        parameters: [
          {
            name: "boardId",
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
    "/lists/{listId}": {
      get: {
        tags: ["Lists"],
        summary: "Get list by ID",
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
              schema: zodSchemas.ListDtoSchema as any,
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
    "/lists/{listId}/position": {
      patch: {
        tags: ["Lists"],
        summary: "Update list position",
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
              schema: {
                type: "object",
                properties: {
                  position: { type: "number", minimum: 0 },
                },
                required: ["position"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "List position updated",
            content: {
              "application/json": {
                schema: zodSchemas.ListDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/lists/{listId}/archive": {
      patch: {
        tags: ["Lists"],
        summary: "Archive/unarchive list",
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
              schema: {
                type: "object",
                properties: {
                  isArchived: { type: "boolean" },
                },
                required: ["isArchived"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "List archive status updated",
            content: {
              "application/json": {
                schema: zodSchemas.ListDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/lists/{listId}/subscribe": {
      patch: {
        tags: ["Lists"],
        summary: "Subscribe/unsubscribe to list",
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
              schema: {
                type: "object",
                properties: {
                  subscribed: { type: "boolean" },
                },
                required: ["subscribed"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "List subscription updated",
            content: {
              "application/json": {
                schema: zodSchemas.ListDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/lists/{listId}/watchers": {
      get: {
        tags: ["Lists"],
        summary: "Get list watchers",
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

    // ==========================
    // CARD ENDPOINTS
    // ==========================
    "/cards": {
      post: {
        tags: ["Cards"],
        summary: "Create a new card",
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
    "/cards/search": {
      get: {
        tags: ["Cards"],
        summary: "Search cards",
        parameters: [
          {
            name: "query",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "boardId",
            in: "query",
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "listId",
            in: "query",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Search results",
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
    },
    "/cards/{id}": {
      get: {
        tags: ["Cards"],
        summary: "Get card by ID",
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
                schema: zodSchemas.CardFullDtoSchema as any,
              },
            },
          },
        },
      },
      patch: {
        tags: ["Cards"],
        summary: "Update card",
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
              schema: zodSchemas.CardDtoSchema as any,
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
    "/cards/{id}/move": {
      patch: {
        tags: ["Cards"],
        summary: "Move card to different list",
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
              schema: {
                type: "object",
                properties: {
                  listId: { type: "string", format: "uuid" },
                  position: { type: "number", minimum: 0 },
                },
                required: ["listId", "position"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Card moved",
            content: {
              "application/json": {
                schema: zodSchemas.CardDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{id}/archive": {
      patch: {
        tags: ["Cards"],
        summary: "Archive/unarchive card",
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
            description: "Card archive status updated",
            content: {
              "application/json": {
                schema: zodSchemas.CardDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{id}/subscribe": {
      patch: {
        tags: ["Cards"],
        summary: "Subscribe/unsubscribe to card",
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
            description: "Card subscription updated",
            content: {
              "application/json": {
                schema: zodSchemas.CardDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{id}/activity": {
      get: {
        tags: ["Cards"],
        summary: "Get card activity logs",
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
            description: "Card activity logs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.ActivityLogDtoSchema as any,
                },
              },
            },
          },
        },
      },
    },
    "/cards/{id}/attachments": {
      get: {
        tags: ["Cards"],
        summary: "Get card attachments",
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
    },
    "/cards/{id}/checklists": {
      get: {
        tags: ["Cards"],
        summary: "Get card checklists",
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
    },
    "/cards/{id}/comments": {
      get: {
        tags: ["Cards"],
        summary: "Get card comments",
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
    },
    "/cards/{id}/assignees": {
      get: {
        tags: ["Cards"],
        summary: "Get card assignees",
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
            description: "Card assignees",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.CardAssigneeDtoSchema as any,
                },
              },
            },
          },
        },
      },
    },
    "/cards/{id}/labels": {
      get: {
        tags: ["Cards"],
        summary: "Get card labels",
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
    },
    "/cards/{id}/watchers": {
      get: {
        tags: ["Cards"],
        summary: "Get card watchers",
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
            description: "Card watchers",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: zodSchemas.CardWatcherDtoSchema as any,
                },
              },
            },
          },
        },
      },
    },

    // ==========================
    // CHECKLIST ENDPOINTS
    // ==========================
    "/cards/{cardId}/checklists": {
      post: {
        tags: ["Checklists"],
        summary: "Create a new checklist",
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
    "/cards/{cardId}/checklists/{id}": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist by ID",
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
              schema: zodSchemas.ChecklistDtoSchema as any,
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
    "/cards/{cardId}/checklists/{id}/items": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist items",
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
    },

    // ==========================
    // CHECKLIST ITEM ENDPOINTS
    // ==========================
    "/cards/{cardId}/checklists/{checklistId}/items": {
      post: {
        tags: ["Checklist Items"],
        summary: "Create a new checklist item",
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
    "/cards/{cardId}/checklists/{checklistId}/items/{id}": {
      get: {
        tags: ["Checklist Items"],
        summary: "Get checklist item by ID",
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
              schema: zodSchemas.ChecklistItemDtoSchema as any,
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
    "/cards/{cardId}/checklists/{checklistId}/items/{id}/toggle": {
      patch: {
        tags: ["Checklist Items"],
        summary: "Toggle checklist item completion",
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
            description: "Checklist item toggled",
            content: {
              "application/json": {
                schema: zodSchemas.ChecklistItemDtoSchema as any,
              },
            },
          },
        },
      },
    },
    "/cards/{cardId}/checklists/{checklistId}/items/{id}/assignees": {
      get: {
        tags: ["Checklist Items"],
        summary: "Get checklist item assignees",
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
    },

    // ==========================
    // CHECKLIST ITEM ASSIGNEE ENDPOINTS
    // ==========================
    "/cards/{cardId}/checklists/{checklistId}/items/{itemId}/assignees": {
      post: {
        tags: ["Checklist Item Assignees"],
        summary: "Assign user to checklist item",
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
    "/cards/{cardId}/checklists/{checklistId}/items/{itemId}/assignees/{userId}":
      {
        delete: {
          tags: ["Checklist Item Assignees"],
          summary: "Remove user from checklist item",
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

    // ==========================
    // ATTACHMENT ENDPOINTS
    // ==========================
    "/cards/{cardId}/attachments": {
      post: {
        tags: ["Attachments"],
        summary: "Create a new attachment",
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
              schema: {
                type: "object",
                properties: {
                  url: { type: "string", format: "uri" },
                  filename: { type: "string", maxLength: 255 },
                  bytes: { type: "number", minimum: 0 },
                  meta: { type: "object" },
                },
                required: ["url"],
              },
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
    "/cards/{cardId}/attachments/{id}": {
      get: {
        tags: ["Attachments"],
        summary: "Get attachment by ID",
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
              schema: {
                type: "object",
                properties: {
                  url: { type: "string", format: "uri" },
                  filename: { type: "string", maxLength: 255 },
                  bytes: { type: "number", minimum: 0 },
                  meta: { type: "object" },
                },
              },
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
    "/comments": {
      post: {
        tags: ["Comments"],
        summary: "Create a new comment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  cardId: { type: "string", format: "uuid" },
                  text: { type: "string", minLength: 1, maxLength: 1000 },
                },
                required: ["cardId", "text"],
              },
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
    "/comments/{id}": {
      get: {
        tags: ["Comments"],
        summary: "Get comment by ID",
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
      put: {
        tags: ["Comments"],
        summary: "Update comment",
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
              schema: {
                type: "object",
                properties: {
                  text: { type: "string", minLength: 1, maxLength: 1000 },
                },
                required: ["text"],
              },
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
    "/comments/card/{cardId}": {
      get: {
        tags: ["Comments"],
        summary: "Get comments for a card",
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
    },

    // ==========================
    // LABEL ENDPOINTS
    // ==========================
    "/labels": {
      post: {
        tags: ["Labels"],
        summary: "Create a new label",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  boardId: { type: "string", format: "uuid" },
                  name: { type: "string", minLength: 1, maxLength: 50 },
                  color: { type: "string", pattern: "^#[0-9A-F]{6}$" },
                },
                required: ["boardId", "name", "color"],
              },
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
    "/labels/{id}": {
      get: {
        tags: ["Labels"],
        summary: "Get label by ID",
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
            description: "Label details",
            content: {
              "application/json": {
                schema: zodSchemas.LabelDtoSchema as any,
              },
            },
          },
        },
      },
      put: {
        tags: ["Labels"],
        summary: "Update label",
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
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 1, maxLength: 50 },
                  color: { type: "string", pattern: "^#[0-9A-F]{6}$" },
                },
              },
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
        parameters: [
          {
            name: "id",
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
    "/labels/board/{boardId}": {
      get: {
        tags: ["Labels"],
        summary: "Get labels for a board",
        parameters: [
          {
            name: "boardId",
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
    },
    "/labels/card": {
      post: {
        tags: ["Labels"],
        summary: "Add label to card",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  cardId: { type: "string", format: "uuid" },
                  labelId: { type: "string", format: "uuid" },
                },
                required: ["cardId", "labelId"],
              },
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
    "/labels/card/{cardId}/{labelId}": {
      delete: {
        tags: ["Labels"],
        summary: "Remove label from card",
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
  },
});
