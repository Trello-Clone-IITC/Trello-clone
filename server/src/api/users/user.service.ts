import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { mapUserToDto } from "./user.mapper.js";

const getMe = async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  // If we got to this service function it means that the user is authenticated with clerk, but the user data is not on our database.
  if (!user) {
    throw new AppError("User exists on clerk service but not in app data");
  }

  return mapUserToDto(user);
};

export const userService = { getMe };
