import { api } from "@/lib/axiosInstance";
import type {
  CreateUserInput,
  User,
  PatchUserInput,
} from "@/shared/types/user";
import type { ApiResponse } from "@/shared/types/apiResponse";
import axios from "axios";

export const getMe = async () => {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");
  return data.data;
};

export const upsertUser = (userData: CreateUserInput) => {
  return api.post("/users/upsert", userData);
};

export const patchUser = (userId: string, userData: PatchUserInput) => {
  return api.patch(`/users/${userId}`, userData);
};

export const signOut = async () => {
  try {
    await api.post<ApiResponse>("/auth/sign-out");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data.data.message || "server error");
    }
    throw err;
  }
};
