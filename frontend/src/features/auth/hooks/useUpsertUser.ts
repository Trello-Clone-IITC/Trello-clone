import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserInput } from "@/shared/types/user";
import { upsertUser } from "../api";

export const useUpsertUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["upsertUser"],
    mutationFn: (body: CreateUserInput) => upsertUser(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
