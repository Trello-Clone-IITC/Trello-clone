import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "@/features/auth/hooks/useMe";
import { useUser } from "@clerk/clerk-react";

export const ProtectedRoute = () => {
  const { data: backendUser, isLoading, error, isFetching } = useMe();
  const { user, isLoaded } = useUser();
  const location = useLocation();

  console.log("Protected route:", {
    backendUser,
    user,
    error,
    isLoading,
    isFetching,
    isLoaded,
    pathname: location.pathname,
  });

  // Still loading Clerk
  if (!isLoaded || isLoading || isFetching) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not onboarded (no backend user or error fetching user) → onboarding
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
