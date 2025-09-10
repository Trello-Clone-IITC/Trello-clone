import { api } from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateWorkspaceInput, WorkspaceDto } from "@ronmordo/types";
import type { ApiResponse } from "@/shared/types/apiResponse";

export const useCreateWorkspace = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      workspaceData: CreateWorkspaceInput
    ): Promise<WorkspaceDto> => {
      const { data } = await api.post<ApiResponse<WorkspaceDto>>(
        "/workspaces",
        workspaceData
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["user-workspaces"],
      });
    },
  });
};
