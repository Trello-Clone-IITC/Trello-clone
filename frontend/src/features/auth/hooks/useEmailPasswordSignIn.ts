import { useSignIn } from "@clerk/clerk-react";
import { useCallback, useState } from "react";
import { readClerkError } from "../helpers/readClerkError";

export function useEmailPasswordSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!isLoaded) {
        setError("Auth not ready");
        return false;
      }
      setSubmitting(true);
      setError(null);

      try {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          return true;
        }

        setError("Unable to complete sign-in.");
        return false;
      } catch (e: unknown) {
        setError(readClerkError(e));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [isLoaded, signIn, setActive]
  );

  return { signInWithPassword, submitting, error };
}
