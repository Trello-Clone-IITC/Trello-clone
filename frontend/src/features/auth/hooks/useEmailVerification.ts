import { useCallback, useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { readClerkError } from "../helpers/readClerkError";

export function useEmailVerification() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (code: string) => {
      if (!isLoaded) {
        setError("Auth not ready");
        return false;
      }
      setVerifying(true);
      setError(null);
      try {
        const complete = await signUp.attemptEmailAddressVerification({ code });
        await setActive({ session: complete.createdSessionId });
        return true;
      } catch (e: unknown) {
        setError(readClerkError(e));
        return false;
      } finally {
        setVerifying(false);
      }
    },
    [isLoaded, signUp, setActive]
  );

  return { verify, verifying, error, isLoaded };
}
