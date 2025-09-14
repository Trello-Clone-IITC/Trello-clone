import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layout/PublicLayout";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Auth pages
import LoginForm from "@/features/auth/components/LoginForm";
import SignUpPage from "@/features/auth/pages/SignUp";
import Recovery from "@/features/auth/components/Recovery";
import { VerifyEmailCodePage } from "@/features/auth/pages/VerifyEmailCodePage";
import { VerifyEmailLinkPage } from "@/features/auth/pages/VerifyEmailLinkPage";
import { CheckEmailPage } from "@/features/auth/pages/CheckEmailPage";
import { OnBoardingPage } from "@/features/auth/pages/OnBoardingPage";
import { SsoCallback } from "@/features/auth/components/Sso-callback";

// Dashboard pages
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ApiDocs from "@/features/docs/ApiDocs";

///Aiman pages
import { AimanPlayground } from "@/features/auth/pages/AimanPlayground";
import Board from "@/features/board/components/Board";
import { BoardExample } from "@/features/board/components/BoardExample";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/verify-email-link" element={<VerifyEmailLinkPage />} />
        <Route path="/verify/otp" element={<VerifyEmailCodePage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/sso-callback" element={<SsoCallback />} />
        <Route path="/docs" element={<ApiDocs />} />
        <Route path="/board-example" element={<BoardExample />} />
        <Route path="/board" element={<Board />} />
      </Route>

      {/* Protected dashboard area */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="on-boarding" element={<OnBoardingPage />} />
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          {/* Aiman playing */}
          <Route path="aiman" element={<AimanPlayground />} />
          <Route path="board" element={<Board />} />
          {/* add more nested dashboard routes here */}
        </Route>
      </Route>
    </Routes>
  );
};
