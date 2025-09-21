import { api } from "@/lib/axiosInstance";
import {
  type WorkspaceDto,
  type CreateWorkspaceInput,
  type BoardDto,
} from "@ronmordo/contracts";
import type { ApiResponse } from "@/shared/types/apiResponse";

export const getUserWorkspaces = async () => {
  const { data } = await api.get<ApiResponse<WorkspaceDto[]>>(`/workspaces`);
  return data.data;
};

export const createWorkspace = (workspaceData: CreateWorkspaceInput) => {
  return api.post<ApiResponse<WorkspaceDto>>("/workspaces", workspaceData);
};

export const getBoardByWorkspace = async (workspaceId: string) => {
  const { data } = await api.get<ApiResponse<BoardDto[]>>(
    `/workspaces/${workspaceId}/boards`
  );
  return data.data;
};
