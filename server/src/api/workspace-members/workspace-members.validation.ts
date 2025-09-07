import { z } from "zod";

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
