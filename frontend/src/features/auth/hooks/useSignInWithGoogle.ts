import { useSignIn } from "@clerk/clerk-react";

export const useSignInWithGoogle = () => {
  const { isLoaded, signIn } = useSignIn();

  const signInWithGoogle = async () => {
    if (!isLoaded) {
      return;
    }
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/on-boarding",
    });
  };
  return { isLoaded, signInWithGoogle };
};
