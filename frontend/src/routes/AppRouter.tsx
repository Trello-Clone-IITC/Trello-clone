import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layout/RootLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import { TestPage } from "@/features/auth/pages/TestPage";
import { SsoCallback } from "@/features/auth/components/Sso-callback";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/sso-callback" element={<SsoCallback />} />
      </Route>
      {/* <Route path="/sign-up" element={<SignUpPage />} /> */}
    </Routes>
  );
};
