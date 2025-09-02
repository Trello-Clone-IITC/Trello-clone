import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatchUserInput } from "@/shared/types/user";
import { useMe } from "./useMe";
import { patchUser } from "../api";

export const useUpdateMe = () => {
  const { data: user } = useMe();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: PatchUserInput) => {
      if (!user) {
        throw new Error("User not loaded.");
      }
      await patchUser(user._id, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
