import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api";
import type { UpdateUserInput } from "@ronmordo/contracts";

export const useUpdateMe = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateUserInput) => updateUser(updateData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["search"], exact: false });
    },
  });
};
