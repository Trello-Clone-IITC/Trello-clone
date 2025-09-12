import { api } from "@/lib/axiosInstance";
import type { WorkspaceDto } from "@ronmordo/types";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { CreateWorkspaceInput } from "@ronmordo/types";

export const getUserWorkspaces = async (userId: string) => {
  const { data } = await api.get<ApiResponse<WorkspaceDto[]>>(
    `/workspaces/user/${userId}`
  );
  return data.data;
};

export const createWorkspace = (workspaceData: CreateWorkspaceInput) => {
  return api.post<ApiResponse<WorkspaceDto>>("/workspaces", workspaceData);
};
