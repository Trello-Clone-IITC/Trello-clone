import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/clerk-react";

export const useSignOut = () => {
  const qc = useQueryClient();
  const { signOut } = useClerk();
  return async () => {
    qc.cancelQueries();
    qc.clear();
    await signOut({ redirectUrl: "/" });
  };
};
