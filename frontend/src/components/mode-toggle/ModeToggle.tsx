import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { useUpdateUserTheme } from "@/features/auth/hooks/useUpdateUserTheme";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { mutateAsync: updateUserTheme } = useUpdateUserTheme();

  const handleChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    try {
      await updateUserTheme(newTheme);
    } catch (e) {
      // Non-blocking: ignore server error; local setting still applies
      // Optionally add a toast here if desired
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
