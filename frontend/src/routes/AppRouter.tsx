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
import BoardsPage from "@/features/dashboard/pages/BoardsPage";
import HomePage from "@/features/dashboard/pages/HomePage";

// Board pages
import BoardPage from "@/features/board-f/pages/BoardPage";

// Api Docs
import ApiDocs from "@/features/docs/ApiDocs";

///Aiman pages
import { AimanPlayground } from "@/features/board/pages/AimanPlayground";
import Board from "@/features/board/components/Board";
import { BoardExample } from "@/features/board/components/BoardExample";
import { AimansBoardTryPage } from "@/features/aimans-board-try";

import { AimansBoardTryPage as AimanUIBoardPage } from "@/features/aiman -with-ui";


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
        <Route path="/b/:boardId" element={<BoardPage />} />

        <Route path="/board-example" element={<BoardExample />} />
        <Route path="/board" element={<Board />} />
          <Route path="aiman/aimans-board-try" element={<AimansBoardTryPage />} />
      </Route>

      {/* Protected dashboard area */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="on-boarding" element={<OnBoardingPage />} />
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="boards" element={<BoardsPage />} />
          {/* Aiman playing */}
          <Route path="aiman" element={<AimanPlayground />} />
          <Route path="aiman/aimans-board-try" element={<AimansBoardTryPage />} />
          <Route path="board" element={<Board />} />
          <Route path="aiman/ui-board/:boardId" element={<AimanUIBoardPage />} />
          {/* add more nested dashboard routes here */}
        </Route>
        {/* Board page with navbar but no sidebar */}
        <Route path="board/:boardId" element={<BoardPage />} />
      </Route>
    </Routes>
  );
};
