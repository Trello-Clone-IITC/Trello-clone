import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/layout/PublicLayout";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { BoardLayout } from "@/layout/BoardLayout";
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
import BoardsPage from "@/features/dashboard/pages/BoardsPage";
import HomePage from "@/features/dashboard/pages/HomePage";

// Board pages
import FinalBoardPage from "@/features/final-final/board/pages/BoardPage"

// Api Docs
import ApiDocs from "@/features/docs/ApiDocs";



//caspi imports
import CaspiBoardPage from "@/features/caspi-playground/board/pages/BoardPage";

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
      </Route>

      {/* Protected dashboard area */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="on-boarding" element={<OnBoardingPage />} />
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="boards" element={<BoardsPage />} />
          {/* <Route path="/b/:boardId" element={<BoardPage />} /> */}
        </Route>
        {/* Caspi board with its own layout */}
        <Route element={<BoardLayout />}>
          <Route path="/caspi/:boardId" element={<CaspiBoardPage />} />
          <Route path="/b/:boardId" element={<FinalBoardPage />} />
        </Route>
        {/* Board page with navbar but no sidebar */}
      </Route>
    </Routes>
  );
};
