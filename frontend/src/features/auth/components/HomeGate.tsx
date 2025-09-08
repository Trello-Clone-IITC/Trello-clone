import { useUser } from "@clerk/clerk-react";
import { useMe } from "../hooks/useMe";
import LoginForm from "./LoginForm";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

export const HomeGate = () => {
  const { user, isLoaded } = useUser();
  const { data: backendUser, isLoading, isError } = useMe();

  // Show loading while checking authentication
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not signed in with Clerk, show login form
  if (!user) {
    return <LoginForm />;
  }

  // If signed in with Clerk but user doesn't exist in backend (onboarding not completed)
  if (isError || !backendUser) {
    return <Navigate to="/on-boarding" replace />;
  }

  // If user exists in backend (onboarding completed), render dashboard at "/"
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
};
