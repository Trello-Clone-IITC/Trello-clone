import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../api";

export const useUpdateUserTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (theme: "light" | "dark" | "system") => {
      await patchUser({ theme });
    },
    onSuccess: () => {
      // Invalidate the user query to refetch updated user data
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
