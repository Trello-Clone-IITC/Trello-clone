import { clerkClient } from "@clerk/express";
import { AppError } from "../../utils/appError.js";

const onBoarding = async (
  clerkUserId: string,
  firstName: string | undefined,
  lastName: string | undefined,
  password: string | undefined
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

export const authService = { onBoarding };
