import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBoardInput } from "@ronmordo/contracts";
import { createBoard } from "../api";

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBoardInput) => createBoard(input),
    onSuccess: (_board, variables) => {
      if (variables.workspaceId) {
        queryClient.invalidateQueries({
          queryKey: ["user-boards", variables.workspaceId],
        });
      }
    },
  });
};
