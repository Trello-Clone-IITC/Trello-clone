import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layout/RootLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import { TestPage } from "@/features/auth/pages/TestPage";
import { SsoCallback } from "@/features/auth/components/Sso-callback";
import SignUpPage from "@/features/auth/pages/SignUp";
import Recovery from "@/features/auth/components/Recovery";
import { VerifyEmailCodePage } from "@/features/auth/pages/VerifyEmailCodePage";
import { VerifyEmailLinkPage } from "@/features/auth/pages/VerifyEmailLinkPage";
import { CheckEmailPage } from "@/features/auth/pages/CheckEmailPage";
import { OnBoardingPage } from "@/features/auth/pages/OnBoardingPage";
import { HomeGate } from "@/features/auth/components/HomeGate"; // logic for landing vs dashboard

export const AppRouter = () => {
  return (
    <Routes>
      {/* Root layout wraps everything */}
      <Route element={<RootLayout />}>
        {/* "/" is the Trello-style smart gate */}
        <Route path="/" element={<HomeGate />} />

        {/* Public auth routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/verify-email-link" element={<VerifyEmailLinkPage />} />
        <Route path="/verify-email-code" element={<VerifyEmailCodePage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/on-boarding" element={<OnBoardingPage />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/sso-callback" element={<SsoCallback />} />

        {/* Example extra route */}
        <Route path="/test" element={<TestPage />} />
      </Route>
    </Routes>
  );
};
