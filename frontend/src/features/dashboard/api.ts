import { api } from "@/lib/axiosInstance";
import type { WorkspaceDto } from "@ronmordo/types";
import type { ApiResponse } from "@/shared/types/apiResponse";

export const getUserWorkspaces = async (userId: string) => {
  const { data } = await api.get<ApiResponse<WorkspaceDto[]>>(
    `/workspaces/user/${userId}`
  );
  return data.data;
};
