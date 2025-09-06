import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { readClerkError } from "../helpers/readClerkError";

export function VerifyEmailLink() {
  const { handleEmailLinkVerification, loaded } = useClerk();
  const [status, setStatus] = useState<
    "loading" | "verified" | "failed" | "expired" | "client_mismatch"
  >("loading");

  useEffect(() => {
    if (!loaded) return;

    (async () => {
      try {
        await handleEmailLinkVerification({
          redirectUrl: `${window.location.origin}/on-boarding`,
          redirectUrlComplete: `${window.location.origin}/`,
        });

        setStatus("verified");
      } catch (err: unknown) {
        const message = readClerkError(err);

        if (message.toLowerCase().includes("expired")) {
          setStatus("expired");
        } else if (message.toLowerCase().includes("client_mismatch")) {
          setStatus("client_mismatch");
        } else {
          setStatus("failed");
        }
      }
    })();
  }, [loaded, handleEmailLinkVerification]);

  if (!loaded || status === "loading") return <p>Verifying your email link…</p>;
  if (status === "expired")
    return <p>❌ This link has expired. Please request a new sign-up link.</p>;
  if (status === "client_mismatch")
    return (
      <p>
        ⚠️ Client mismatch. Open the link in the <b>same device & browser</b>{" "}
        you used to start sign-up, or temporarily disable that requirement in
        Clerk while testing.
      </p>
    );
  if (status === "failed")
    return <p>❌ Email verification failed. Please try signing up again.</p>;
  return null;
}
