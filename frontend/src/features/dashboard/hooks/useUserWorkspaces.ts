import { useQuery } from "@tanstack/react-query";
import { getUserWorkspaces } from "../api";
import { useMe } from "@/features/auth/hooks/useMe";

export const useUserWorkspaces = () => {
  const { data: user, isLoading: userLoading, error: useError } = useMe();

  return useQuery({
    queryKey: ["user-workspaces", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      return await getUserWorkspaces(user.id);
    },
    enabled: !!user?.id && !userLoading,
    staleTime: 120 * 60 * 1000,
    retry: false,
  });
};
