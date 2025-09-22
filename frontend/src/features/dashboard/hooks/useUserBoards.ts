import { useQuery } from "@tanstack/react-query";
import { getBoardByWorkspace } from "../api";
import { useMe } from "@/features/auth/hooks/useMe";

export const useUserBoards = (workspaceId: string) => {
  const { data: user, isLoading: userLoading } = useMe();

  return useQuery({
    queryKey: ["user-boards", workspaceId],
    queryFn: async () => {
      return await getBoardByWorkspace(workspaceId);
    },
    enabled: !!user?.id && !userLoading && !!workspaceId,
    staleTime: 120 * 60 * 1000,
    retry: false,
  });
};
