import type { UpdateUserInput } from "@ronmordo/contracts";
import { getCache, setCache } from "../../lib/cache.js";
import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { mapUserDtoToUpdateInput, mapUserToDto } from "./user.mapper.js";
import { clerkClient, getAuth } from "@clerk/express";
import { type Request } from "express";
import { seedTrelloExampleWorkspace } from "./trello-example.seed.js";




const getMe = async (clerkUserId: string) => {
  // First we get the latest user data from clerk provider.
  const { emailAddresses, fullName, imageUrl } =
    await clerkClient.users.getUser(clerkUserId);

  const existing = await prisma.user.findUnique({ where: { clerkId: clerkUserId } });
  console.log("Existing user:", existing);

  if (!fullName) {
    throw new AppError("Full name isnt resolved yet");
  }
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
      inbox: { create: {} },
    },
  });
  if (!existing) {
    await seedTrelloExampleWorkspace(prisma, user.id, {
      defaultMemberIds: [
        "c18023c3-717c-487f-b9b3-c24e4a34e21d",//TODO: replace with your clerk test user ids
        "73ee53ee-f741-4aeb-ba54-d000a60c8063",
      ],
      workspaceName: "my Trello Example Workspace",
      boardName: "Trello Clone- Project Example",
    });
  }

  // Return the UserDto.
  return mapUserToDto(user);
};

const updateUser = async (userId: string, updateData: UpdateUserInput) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: mapUserDtoToUpdateInput(updateData),
  });

  return mapUserToDto(updatedUser);
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

const getUserIdByClerkId = async (clerkId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user.id;
};

const getUserIdByRequest = async (req: Request) => {
  let { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    throw new AppError("User not authenticated", 401);
  }

  const cached = await getCache<string>(`user:${clerkId}:id`);

  if (cached) {
    return cached;
  }

  const userId = await getUserIdByClerkId(clerkId);

  await setCache<string>(`user:${clerkId}:id`, userId, 120);

  return userId;
};

export const userService = {
  getMe,
  getUserByEmail,
  getUserIdByClerkId,
  getUserIdByRequest,
  updateUser,
};
