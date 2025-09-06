import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layout/RootLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import { TestPage } from "@/features/auth/pages/TestPage";
import { SsoCallback } from "@/features/auth/components/Sso-callback";
import VerifyEmail from "@/features/auth/components/VerifyEmail";
import SignUpPage from "@/features/auth/pages/SignUp";
import Recovery from "@/features/auth/components/Recovery";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/recovery" element={<Recovery />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/sso-callback" element={<SsoCallback />} />
      </Route>
    </Routes>
  );
};
