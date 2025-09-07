import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useMe } from "@/features/auth/hooks/useMe";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user, isLoading, isError, error } = useMe();
  const navigate = useNavigate();
  if (isLoading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  if (!user) navigate("/login");
  return children;
};
