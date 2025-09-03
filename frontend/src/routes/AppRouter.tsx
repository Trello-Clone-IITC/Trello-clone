import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layout/RootLayout";
import LoginForm from "@/features/auth/components/LoginForm";
export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/login" element={<LoginForm />} />
      </Route>
      {/* <Route path="/sign-up" element={<SignUpPage />} /> */}
    </Routes>
  );
};
