import { z } from "zod";

// Board validation schemas based on Prisma schema
export const createBoardSchema = z.object({
  body: z.object({
    workspaceId: z.string().uuid().optional(),
    name: z
      .string()
      .min(1, "Board name is required")
      .max(255, "Board name too long"),
    description: z.string().max(1000, "Description too long").optional(),
    background: z.string().url("Invalid background URL").optional(),
    createdBy: z.string().uuid("Invalid user ID"),
    allowCovers: z.boolean().optional(),
    showComplete: z.boolean().optional(),
    visibility: z.enum(["Private", "WorkspaceMembers", "Public"]).optional(),
    memberManage: z.enum(["Admins", "Members"]).optional(),
    commenting: z
      .enum(["Disabled", "BoardMembers", "WorkspaceMembers"])
      .optional(),
  }),
});

export const updateBoardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Board name is required")
      .max(255, "Board name too long")
      .optional(),
    description: z.string().max(1000, "Description too long").optional(),
    background: z.string().url("Invalid background URL").optional(),
    allowCovers: z.boolean().optional(),
    showComplete: z.boolean().optional(),
    visibility: z.enum(["Private", "WorkspaceMembers", "Public"]).optional(),
    memberManage: z.enum(["Admins", "Members"]).optional(),
    commenting: z
      .enum(["Disabled", "BoardMembers", "WorkspaceMembers"])
      .optional(),
    lastActivityAt: z.string().datetime().optional(),
  }),
});

export const boardIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
  }),
});

export const addBoardMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
    role: z.enum(["Admin", "Member", "Observer"]).default("Member"),
  }),
});

export const updateBoardMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    userId: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum(["Admin", "Member", "Observer"]),
  }),
});

export const removeBoardMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    userId: z.string().uuid("Invalid user ID"),
  }),
});

// List validation schemas
export const createListSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "List name is required")
      .max(255, "List name too long"),
    position: z.number().int().min(0).optional(),
    isArchived: z.boolean().optional(),
  }),
});

export const updateListSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    listId: z.string().uuid("Invalid list ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "List name is required")
      .max(255, "List name too long")
      .optional(),
    position: z.number().int().min(0).optional(),
    isArchived: z.boolean().optional(),
  }),
});

export const listIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    listId: z.string().uuid("Invalid list ID"),
  }),
});

// Search validation schema
export const searchBoardsSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Search query is required"),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
