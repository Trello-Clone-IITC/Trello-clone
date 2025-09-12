import { useQuery } from "@tanstack/react-query";
import { getUserWorkspaces } from "../api";
import { useMe } from "@/features/auth/hooks/useMe";

export const useUserWorkspaces = () => {
  const { data: user, isLoading: userLoading } = useMe();

  return useQuery({
    queryKey: ["user-workspaces", user?.id],
    queryFn: async () => {
      return await getUserWorkspaces(user!.id);
    },
    enabled: !!user?.id && !userLoading,
    staleTime: 120 * 60 * 1000,
    retry: false,
  });
};
