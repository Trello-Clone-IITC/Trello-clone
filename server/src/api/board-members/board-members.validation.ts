import { z } from "zod";

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

export const boardIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
  }),
});
