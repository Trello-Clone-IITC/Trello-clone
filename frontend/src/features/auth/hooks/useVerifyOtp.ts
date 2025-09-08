import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { readClerkError } from "../helpers/readClerkError";
import { useSignIn } from "@clerk/clerk-react";

export const useVerifyOtp = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = useCallback(
    async (code: string) => {
      if (!isLoaded) {
        setError("Auth not ready");
        return false;
      }

      setSubmitting(true);
      setError(null);

      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          navigate("/on-boarding", { replace: true });
          return true;
        }

        setError("Invalid or expired code.");
        return false;
      } catch (err: unknown) {
        const error = readClerkError(err);
        setError(error);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [isLoaded, signIn, setActive, navigate]
  );

  return {
    verifyOtp,
    submitting,
    error,
  };
};
