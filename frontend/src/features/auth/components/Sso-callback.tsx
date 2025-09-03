import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { ClockLoader } from "react-spinners";

export function SsoCallback() {
  const { theme } = useTheme();
  return (
    <div className="flex-1 flex justify-center items-center p-8">
      <Card className="p-14 flex flex-col items-center justify-center gap-6 min-h-64 text-var(--primary)">
        <ClockLoader
          size={45}
          color={theme === "dark" ? "#fafafa" : "#0a0a0a"}
        />
        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/test"
          signUpFallbackRedirectUrl="/test"
        />
        <p>Welcome! We're loading your user information.</p>
      </Card>
    </div>
  );
}
