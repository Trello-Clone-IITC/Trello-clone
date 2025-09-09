import { clerkClient } from "@clerk/express";
import { AppError } from "../../utils/appError.js";
import { userService } from "../users/user.service.js";

const checkEmail = async (email: string) => {
  const existsInDb = !!(await userService.getUserByEmail(email));
  const existsInClerkProvider = (
    await clerkClient.users.getUserList()
  ).data.some((user) => user.emailAddresses[0].emailAddress === email);
  return { clerkUserExists: existsInClerkProvider, dbUserExists: existsInDb };
};

const onBoarding = async (
  clerkUserId: string,
  firstName?: string,
  lastName?: string,
  password?: string
) => {
  if (!firstName || !lastName || !password) {
    throw new AppError("Missing fields", 400);
  }

  return clerkClient.users.updateUser(clerkUserId, {
    firstName,
    lastName,
    password,
  });
};

export const authService = { onBoarding, checkEmail };
