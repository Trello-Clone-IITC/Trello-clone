import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "../api";
export const useCreateWorkspace = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["user-workspaces"],
      });
    },
  });
};
