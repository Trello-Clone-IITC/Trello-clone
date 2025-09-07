import { useSignIn } from "@clerk/clerk-react";
import type { Strategies } from "../types";

export const useOauthSignIn = () => {
  const { isLoaded, signIn } = useSignIn();

  const oauthSignIn = async (strategy: Strategies) => {
    if (!isLoaded) {
      return;
    }
    await signIn.authenticateWithRedirect({
      strategy: strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/on-boarding",
    });
  };
  return { isLoaded, signIn, oauthSignIn };
};
