import { getMe } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "./useApiAuth";

export const useMe = () => {
  const { authLoaded, userLoaded, isSignedIn } = useApiAuth();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getMe();
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: isSignedIn && authLoaded && userLoaded,
  });
};
