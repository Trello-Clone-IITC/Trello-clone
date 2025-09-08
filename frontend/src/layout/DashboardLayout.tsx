import { Navbar } from "@/features/navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useContext } from "react";
import { ThemeProviderContext } from "@/context/ThemeContext";

export function DashboardLayout() {
  const { theme } = useContext(ThemeProviderContext);

  const getMainBackgroundColor = () => {
    if (theme === "light") return "#ffffff";
    return "#1d2125";
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* TO DO ------> insert NavBar to Header component and render it here */}
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: getMainBackgroundColor() }}
        >
          <div className="p-3 md:p-6">{<Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
