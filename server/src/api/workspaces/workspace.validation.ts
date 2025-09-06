import { z } from "zod";

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Workspace name is required")
      .max(255, "Workspace name too long"),
    description: z.string().max(1000, "Description too long").optional(),
    createdBy: z.string().uuid("Invalid user ID"),
    visibility: z.enum(["Private", "Public"]).optional(),
    premium: z.boolean().optional(),
    type: z
      .enum([
        "Marketing",
        "SalesCrm",
        "HumenResources",
        "SmallBusiness",
        "EngineeringIt",
        "Education",
        "Operations",
        "Other",
      ])
      .optional(),
    workspaceMembershipRestrictions: z
      .enum(["Anybody", "SpecificDomain"])
      .optional(),
    publicBoardCreation: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    workspaceBoardCreation: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    privateBoardCreation: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    publicBoardDeletion: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    workspaceBoardDeletion: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    privateBoardDeletion: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    allowGuestSharing: z.enum(["Anybody", "OnlyWorkspaceMember"]).optional(),
    allowSlackIntegration: z.enum(["WorkspaceMember", "Admins"]).optional(),
  }),
});

export const updateWorkspaceSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid workspace ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Workspace name is required")
      .max(255, "Workspace name too long")
      .optional(),
    description: z.string().max(1000, "Description too long").optional(),
    visibility: z.enum(["Private", "Public"]).optional(),
    premium: z.boolean().optional(),
    type: z
      .enum([
        "Marketing",
        "SalesCrm",
        "HumenResources",
        "SmallBusiness",
        "EngineeringIt",
        "education",
        "Operations",
        "Other",
      ])
      .optional(),
    workspaceMembershipRestrictions: z
      .enum(["Anybody", "SpecificDomain"])
      .optional(),
    publicBoardCreation: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    workspaceBoardCreation: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    privateBoardCreation: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    publicBoardDeletion: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    workspaceBoardDeletion: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    privateBoardDeletion: z
      .enum(["WorkspaceMember", "WorkspaceAdmin", "Nobody"])
      .optional(),
    allowGuestSharing: z.enum(["Anybody", "OnlyWorkspaceMember"]).optional(),
    allowSlackIntegration: z.enum(["WorkspaceMember", "Admins"]).optional(),
  }),
});

export const workspaceIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid workspace ID"),
  }),
});

export const addWorkspaceMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid workspace ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
    role: z.enum(["Admin", "Member", "Guest"]).optional(),
  }),
});

export const updateWorkspaceMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid workspace ID"),
    userId: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum(["Admin", "Member", "Guest"]),
  }),
});

export const removeWorkspaceMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid workspace ID"),
    userId: z.string().uuid("Invalid user ID"),
  }),
});

export const getWorkspacesByUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
});

export const searchWorkspacesSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Search term is required"),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
