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
              schema: {
                $ref: "#/components/schemas/CreateOnBoardingInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Onboarding completed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserDtoSchema" },
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
                schema: { $ref: "#/components/schemas/UserDtoSchema" },
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
                  items: { $ref: "#/components/schemas/WorkspaceDtoSchema" },
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
                  items: { $ref: "#/components/schemas/WorkspaceDtoSchema" },
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
              schema: {
                $ref: "#/components/schemas/CreateWorkspaceInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Workspace created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WorkspaceDtoSchema" },
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
                  items: { $ref: "#/components/schemas/WorkspaceDtoSchema" },
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
                schema: { $ref: "#/components/schemas/WorkspaceDtoSchema" },
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
              schema: { $ref: "#/components/schemas/UpdateWorkspaceSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Workspace updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WorkspaceDtoSchema" },
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
          "204": {
            description: "Workspace deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Workspace deleted successfully",
                    },
                  },
                },
              },
            },
          },
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
                  items: { $ref: "#/components/schemas/BoardDtoSchema" },
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
              schema: { $ref: "#/components/schemas/CreateBoardInputSchema" },
            },
          },
        },
        responses: {
          "201": {
            description: "Board created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoardDtoSchema" },
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
                  items: {
                    $ref: "#/components/schemas/WorkspaceMemberDtoSchema",
                  },
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
              schema: {
                $ref: "#/components/schemas/CreateWorkspaceMemberInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Member added",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/WorkspaceMemberDtoSchema",
                },
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
              schema: {
                $ref: "#/components/schemas/UpdateWorkspaceMemberSchema",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Member role updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/WorkspaceMemberDtoSchema",
                },
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
          "204": {
            description: "Member removed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Member removed successfully",
                    },
                  },
                },
              },
            },
          },
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
                schema: { $ref: "#/components/schemas/BoardDtoSchema" },
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
              schema: { $ref: "#/components/schemas/UpdateBoardSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Board updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoardDtoSchema" },
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
          "204": {
            description: "Board deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Board deleted successfully",
                    },
                  },
                },
              },
            },
          },
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
                schema: { $ref: "#/components/schemas/BoardFullDtoSchema" },
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
                  items: { $ref: "#/components/schemas/BoardMemberDtoSchema" },
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
              schema: {
                $ref: "#/components/schemas/CreateBoardMemberInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Member added",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoardMemberDtoSchema" },
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
              schema: { $ref: "#/components/schemas/UpdateBoardMemberSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Member role updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoardMemberDtoSchema" },
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
          "204": {
            description: "Member removed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Member removed successfully",
                    },
                  },
                },
              },
            },
          },
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
                  items: { $ref: "#/components/schemas/ListDtoSchema" },
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
              schema: { $ref: "#/components/schemas/CreateListInputSchema" },
            },
          },
        },
        responses: {
          "201": {
            description: "List created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ListDtoSchema" },
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
                  items: { $ref: "#/components/schemas/LabelDtoSchema" },
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
              schema: { $ref: "#/components/schemas/CreateLabelInputSchema" },
            },
          },
        },
        responses: {
          "201": {
            description: "Label created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LabelDtoSchema" },
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
                schema: { $ref: "#/components/schemas/ListDtoSchema" },
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
              schema: { $ref: "#/components/schemas/UpdateListSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "List updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ListDtoSchema" },
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
          "204": {
            description: "List deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "List deleted successfully",
                    },
                  },
                },
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
                  items: { $ref: "#/components/schemas/ListWatcherDtoSchema" },
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
                schema: { $ref: "#/components/schemas/ListWatcherDtoSchema" },
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
          "204": {
            description: "Watcher removed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Watcher removed successfully",
                    },
                  },
                },
              },
            },
          },
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
                  items: { $ref: "#/components/schemas/CardDtoSchema" },
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
              schema: { $ref: "#/components/schemas/CreateCardInputSchema" },
            },
          },
        },
        responses: {
          "201": {
            description: "Card created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CardDtoSchema" },
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
                schema: { $ref: "#/components/schemas/CardDtoSchema" },
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
              schema: { $ref: "#/components/schemas/UpdateCardSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Card updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CardDtoSchema" },
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
          "204": {
            description: "Card deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Card deleted successfully",
                    },
                  },
                },
              },
            },
          },
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
                  items: { $ref: "#/components/schemas/ChecklistDtoSchema" },
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
              schema: {
                $ref: "#/components/schemas/CreateChecklistInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Checklist created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChecklistDtoSchema" },
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
                  items: { $ref: "#/components/schemas/CardLabelDtoSchema" },
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
              schema: {
                $ref: "#/components/schemas/CreateCardLabelInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Label added to card",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CardLabelDtoSchema" },
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
          "204": {
            description: "Label removed from card",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Label removed from card successfully",
                    },
                  },
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
                  items: { $ref: "#/components/schemas/CommentDtoSchema" },
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
              schema: { $ref: "#/components/schemas/CreateCommentInputSchema" },
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentDtoSchema" },
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
                  items: { $ref: "#/components/schemas/AttachmentDtoSchema" },
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
              schema: {
                $ref: "#/components/schemas/CreateAttachmentInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Attachment created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AttachmentDtoSchema" },
              },
            },
          },
        },
      },
    },

    // ==========================
    // CHECKLIST ENDPOINTS
    // ==========================
    "/checklists/{id}": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist by ID",
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
            description: "Checklist details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChecklistDtoSchema" },
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
              schema: { $ref: "#/components/schemas/UpdateChecklistSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Checklist updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChecklistDtoSchema" },
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
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": {
            description: "Checklist deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Checklist deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/checklists/{checklistId}/checklistItems": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist items",
        security: [{ bearerAuth: [] }],
        parameters: [
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
                  items: {
                    $ref: "#/components/schemas/ChecklistItemDtoSchema",
                  },
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
              schema: {
                $ref: "#/components/schemas/CreateChecklistItemInputSchema",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Checklist item created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChecklistItemDtoSchema" },
              },
            },
          },
        },
      },
    },

    "/checklists/{checklistId}/checklistItems/{id}": {
      get: {
        tags: ["Checklists"],
        summary: "Get checklist item by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
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
                schema: { $ref: "#/components/schemas/ChecklistItemDtoSchema" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Checklists"],
        summary: "Update checklist item",
        security: [{ bearerAuth: [] }],
        parameters: [
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
              schema: {
                $ref: "#/components/schemas/UpdateChecklistItemSchema",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Checklist item updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChecklistItemDtoSchema" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Checklists"],
        summary: "Delete checklist item",
        security: [{ bearerAuth: [] }],
        parameters: [
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
          "204": {
            description: "Checklist item deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Checklist item deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/checklists/{checklistId}/checklistItems/{itemId}/checklistItemAssignees":
      {
        get: {
          tags: ["Checklists"],
          summary: "Get checklist item assignees",
          security: [{ bearerAuth: [] }],
          parameters: [
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
                    items: {
                      $ref: "#/components/schemas/ChecklistItemAssigneeDtoSchema",
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Checklists"],
          summary: "Assign user to checklist item",
          security: [{ bearerAuth: [] }],
          parameters: [
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
                  schema: {
                    $ref: "#/components/schemas/ChecklistItemAssigneeDtoSchema",
                  },
                },
              },
            },
          },
        },
      },
    "/checklists/{checklistId}/checklistItems/{itemId}/checklistItemAssignees/{userId}":
      {
        delete: {
          tags: ["Checklists"],
          summary: "Remove user from checklist item",
          security: [{ bearerAuth: [] }],
          parameters: [
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
            "204": {
              description: "User removed from item",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "User removed from item successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

    "/cards/{cardId}/attachments/{id}": {
      get: {
        tags: ["Cards"],
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
                schema: { $ref: "#/components/schemas/AttachmentDtoSchema" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Cards"],
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
              schema: { $ref: "#/components/schemas/UpdateAttachmentSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Attachment updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AttachmentDtoSchema" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Cards"],
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
          "204": {
            description: "Attachment deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Attachment deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ==========================
    // COMMENT ENDPOINTS
    // ==========================
    "/cards/{id}/comments/{commentId}": {
      get: {
        tags: ["Cards"],
        summary: "Get comment by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
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
                schema: { $ref: "#/components/schemas/CommentDtoSchema" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Cards"],
        summary: "Update comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCommentSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Comment updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentDtoSchema" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Cards"],
        summary: "Delete comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": {
            description: "Comment deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Comment deleted successfully",
                    },
                  },
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
    "/boards/{id}/labels/{labelId}": {
      get: {
        tags: ["Boards"],
        summary: "Get label by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
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
          "200": {
            description: "Label details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LabelDtoSchema" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Boards"],
        summary: "Update label",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateLabelSchema" },
            },
          },
        },
        responses: {
          "200": {
            description: "Label updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LabelDtoSchema" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Boards"],
        summary: "Delete label",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
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
          "204": {
            description: "Label deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Label deleted successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});
