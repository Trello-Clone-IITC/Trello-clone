import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";

const getMe = async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const authService = { getMe };
