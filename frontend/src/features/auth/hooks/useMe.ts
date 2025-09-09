import { getMe } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "./useApiAuth";
import { useTheme } from "@/hooks/useTheme";

export const useMe = () => {
  const { authLoaded, userLoaded, isSignedIn } = useApiAuth();
  const { setTheme } = useTheme();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getMe();
      setTheme(user.theme);
      return user;
    },
    retry: 3,
    staleTime: 120 * 60 * 1000,
    enabled: isSignedIn && authLoaded && userLoaded,
  });
};
