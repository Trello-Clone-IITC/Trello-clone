import { useSignUp } from "@clerk/clerk-react";
import { useCallback, useState } from "react";
import { readClerkError } from "../helpers/readClerkError";

export function useEmailPasswordSignup() {
  const { isLoaded, signUp } = useSignUp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (email: string, password: string) => {
      if (!isLoaded) {
        setError("Auth not ready");
        return false;
      }
      setSubmitting(true);
      setError(null);
      try {
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        return true;
      } catch (e: unknown) {
        setError(readClerkError(e));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [isLoaded, signUp]
  );

  return { submit, submitting, error };
}
