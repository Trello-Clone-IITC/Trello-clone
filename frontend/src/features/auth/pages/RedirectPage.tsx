import { useMe } from "../hooks/useMe";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { ClockLoader } from "react-spinners";
import { useTheme } from "@/hooks/useTheme.ts";

export const RedirectPage = () => {
  const { isLoading, isSuccess } = useMe();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (isSuccess) {
      navigate("/", { replace: true });
    }
  }, [isLoading, isSuccess, navigate]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center p-8">
        <Card className="p-14 flex flex-col items-center justify-center gap-6 min-h-64 text-var(--primary)">
          <ClockLoader
            size={45}
            color={theme === "dark" ? "#fafafa" : "#0a0a0a"}
          />
          <p>Welcome! We’re loading your user information.</p>
        </Card>
      </div>
    );
  }
};
