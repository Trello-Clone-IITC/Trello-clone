import { useContext } from "react";
import { AppProviderContext } from "@/context/ThemeContext";

export function useAppContext() {
  const context = useContext(AppProviderContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
