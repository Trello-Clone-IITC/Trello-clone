import { useSignIn } from "@clerk/clerk-react";
import { useCallback, useState } from "react";
import { readClerkError } from "../helpers/readClerkError";
import { useQueryClient } from "@tanstack/react-query";

export function useEmailPasswordSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

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

        console.log(result);

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          qc.invalidateQueries({ queryKey: ["me"] });
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
    [isLoaded, signIn, setActive, qc]
  );

  return { signInWithPassword, submitting, error };
}
