import { Navbar } from "@/features/navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useTheme } from "@/hooks/useTheme";

export function DashboardLayout() {
  const { theme } = useTheme();

  const getMainBackgroundColor = () => {
    if (theme === "light") return "#ffffff";
    return "#1f1f21";
  };

  return (
    <div className="h-dvh w-dvw flex flex-col">
      {/* TO DO ------> insert NavBar to Header component and render it here */}
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto px-12 pb-14 scrollbar"
          style={{ backgroundColor: getMainBackgroundColor() }}
        >
          <div className="p-0 h-full mt-[40px] mx-[49.5px] mb-0">
            {<Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
