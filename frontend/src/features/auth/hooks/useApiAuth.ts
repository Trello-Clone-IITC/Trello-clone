import { useAuth, useUser } from "@clerk/clerk-react";

export const useApiAuth = () => {
  const { isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  return { authLoaded, userLoaded, isSignedIn };
};
