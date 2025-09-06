import { useSignUp, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { readClerkError } from "../helpers/readClerkError";

type Status = "idle" | "email_sent" | "done";

export function useEmailPasswordSignUp() {
  const { isLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);

  const startSignup = async (email: string) => {
    if (!isLoaded || !signUp) {
      setError("Auth not ready");
      return false;
    }
    setSending(true);

    try {
      // 1) Create the sign-up attempt
      await signUp.create({ emailAddress: email });

      // 2) Kick off email-link flow (don’t await polling)
      const { startEmailLinkFlow } = signUp.createEmailLinkFlow();
      startEmailLinkFlow({
        redirectUrl: `${window.location.origin}/verify-email-link`,
      }).catch((e: unknown) => {
        setError(readClerkError(e));
      });

      setStatus("email_sent");
      return true;
    } catch (e: unknown) {
      setError(readClerkError(e));
      return false;
    } finally {
      setSending(false);
    }
  };

  const completeOnboarding = async (
    firstName: string,
    lastName: string,
    password: string
  ) => {
    if (!isLoaded || !signUp) return false;
    setCompleting(true);
    try {
      await signUp.update({
        firstName,
        lastName,
        password,
      });

      if (signUp.status === "complete" && signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        setStatus("done");
      }
      return true;
    } catch (e: unknown) {
      setError(readClerkError(e));
      return false;
    } finally {
      setCompleting(false);
    }
  };

  return {
    startSignup,
    completeOnboarding,
    status,
    error,
    sending,
    completing,
  };
}
