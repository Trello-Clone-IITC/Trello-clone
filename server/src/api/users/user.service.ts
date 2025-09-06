import { prisma } from "../../lib/prismaClient.js";
import { mapUserToDto } from "./user.mapper.js";
import { clerkClient } from "@clerk/express";

const getMe = async (clerkUserId: string) => {
  // First we get the latest user data from clerk provider.
  const { emailAddresses, fullName, imageUrl } =
    await clerkClient.users.getUser(clerkUserId);

  // Since we enfore full name and email on clerk signUp we can safely assume that full name exists on clerk User.
  const email = emailAddresses[0].emailAddress;

  // Next we upsert the user which means if the user exists update it with latest data, if not, create it.
  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUserId,
    },
    update: {
      email,
      fullName: fullName!,
      avatarUrl: imageUrl,
    },
    create: {
      clerkId: clerkUserId,
      email,
      fullName: fullName!,
      avatarUrl: imageUrl,
    },
  });
  // const user = await prisma.user.findFirst({
  //   where: {
  //     clerkId: clerkUserId,
  //   },
  // });
  // console.log("user", user);
  // if (!user) {
  //   throw new Error("User not found");
  // }

  // Return the UserDto.
  return mapUserToDto(user);
};

export const userService = { getMe };
