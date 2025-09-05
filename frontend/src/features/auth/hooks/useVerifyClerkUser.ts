import { useSignIn } from "@clerk/clerk-react";
import { useCallback, useState } from "react";
import { readClerkError } from "../helpers/readClerkError";

export function useVerifyClerkUser() {
  const { isLoaded, signIn } = useSignIn();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  const checkUserExists = useCallback(
    async (email: string) => {
      if (!isLoaded) {
        setError("Auth not ready");
        return false;
      }

      setChecking(true);
      setError(null);
      setUserExists(null);

      try {
        // Create a sign-in instance to check if user exists
        const result = await signIn.create({
          identifier: email,
        });

        // If status is 'needs_first_factor', user exists and needs password
        if (result.status === "needs_first_factor") {
          setUserExists(true);
          return true;
        }

        // If status is 'needs_identifier', user doesn't exist
        if (result.status === "needs_identifier") {
          setUserExists(false);
          return false;
        }

        // Handle other statuses
        setUserExists(false);
        return false;
      } catch (e: unknown) {
        const errorMessage = readClerkError(e);
        setError(errorMessage);
        setUserExists(false);
        return false;
      } finally {
        setChecking(false);
      }
    },
    [isLoaded, signIn]
  );

  const reset = useCallback(() => {
    setUserExists(null);
    setError(null);
    setChecking(false);
  }, []);

  return {
    checkUserExists,
    checking,
    error,
    userExists,
    reset,
  };
}
