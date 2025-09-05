import { prisma } from "../../lib/prismaClient.js";
import type { User } from "@prisma/client";
import type { UserDto, Theme } from "@ronmordo/types";
import { AppError } from "../../utils/appError.js";

const toUserDto = (user: User) => {
  const userDto: UserDto = {
    ...user,
    theme: user.theme.toLowerCase() as Theme,
    createdAt: user.createdAt.toISOString(),
  };
  return userDto;
};

const getMe = async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  // If we got to this service function it means that the user is authenticated with clerk, but the user data is not on our database.
  if (!user) {
    throw new AppError("User exists on clerk service but not in app data");
  }

  return toUserDto(user);
};

export const userService = { toUserDto, getMe };
