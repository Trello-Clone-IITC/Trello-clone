import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "@/features/auth/hooks/useMe";
import { useUser } from "@clerk/clerk-react";

export const ProtectedRoute = () => {
  const { data: backendUser, isLoading } = useMe();
  const { user, isLoaded } = useUser();
  const location = useLocation();

  console.log("Protected route:", backendUser, user);

  // Still loading Clerk or backend user
  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not onboarded → onboarding
  if (!backendUser && location.pathname !== "/on-boarding") {
    return <Navigate to="/on-boarding" replace />;
  }

  // already onboarded but tries to go back to onboarding manually
  if (backendUser && location.pathname === "/on-boarding") {
    return <Navigate to="/" replace />;
  }

  // Otherwise → show protected content
  return <Outlet />;
};
