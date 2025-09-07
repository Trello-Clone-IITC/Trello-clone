import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layout/RootLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import { TestPage } from "@/features/auth/pages/TestPage";
import { SsoCallback } from "@/features/auth/components/Sso-callback";
import SignUpPage from "@/features/auth/pages/SignUp";
import Recovery from "@/features/auth/components/Recovery";
import { ProtectedRoute } from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { VerifyEmailCodePage } from "@/features/auth/pages/VerifyEmailCodePage";
import { VerifyEmailLinkPage } from "@/features/auth/pages/VerifyEmailLinkPage";
import { CheckEmailPage } from "@/features/auth/pages/CheckEmailPage";
import { OnBoardingPage } from "@/features/auth/pages/OnBoardingPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
      </Route>
      <Route element={<RootLayout />}>
        <Route path="/test" element={<TestPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/verify-email-link" element={<VerifyEmailLinkPage />} />
        <Route path="/verify-email-code" element={<VerifyEmailCodePage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/on-boarding" element={<OnBoardingPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/sso-callback" element={<SsoCallback />} />
      </Route>
    </Routes>
  );
};
