import { api } from "@/lib/axiosInstance";
import type { UserDto } from "@ronmordo/types";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { OnBoardingData } from "./types";

export const getMe = async () => {
  const { data } = await api.get<ApiResponse<UserDto>>("/users/me");
  return data.data;
};

export const patchUser = (
  userData: Partial<Omit<UserDto, "id" | "clerkId" | "email" | "createdAt">>
) => {
  return api.patch(`/users/me`, userData);
};

export const onBoarding = (data: OnBoardingData) => {
  return api.post("/auth/onboarding", data);
};

export const userExists = async (email: string) => {
  const response = await api.get<
    ApiResponse<{ clerkUserExists: boolean; dbUserExists: boolean }>
  >(`/auth/checkEmail?email=${email}`);
  return response.data.data;
};
