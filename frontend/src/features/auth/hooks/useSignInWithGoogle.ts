import { useSignIn } from "@clerk/clerk-react";
import type { Strategies } from "../types";

export const useOuthSignIn = () => {
  const { isLoaded, signIn } = useSignIn();

  const oauthsignIn = async (strategy: Strategies) => {
    if (!isLoaded) {
      return;
    }
    await signIn.authenticateWithRedirect({
      strategy: strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/on-boarding",
    });
  };
  return { isLoaded, signIn, oauthsignIn };
};
