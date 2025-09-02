import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useUpsertUser } from "@/features/auth/hooks/useUpsertUser";

export const useEnsureBackendUser = () => {
  const { user, isLoaded } = useUser();
  const { mutateAsync: upsertUser } = useUpsertUser();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasRun.current) return;

    const run = async () => {
      hasRun.current = true;

      const payload = {
        email: user.primaryEmailAddress?.emailAddress ?? "",
      };

      await upsertUser(payload);
    };

    void run();
  }, [isLoaded, user, upsertUser]);

  return { ready: isLoaded, user };
};
