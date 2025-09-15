import { Navbar } from "@/features/navbar";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/features/dashboard";
import { useTheme } from "@/hooks/useTheme";

export function DashboardLayout() {
  const { theme } = useTheme();

  const getMainBackgroundColor = () => {
    if (theme === "light") return "#ffffff";
    return "#1f1f21";
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* TO DO ------> insert NavBar to Header component and render it here */}
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="overflow-y-auto scrollbar pt-0 px-12 pb-14 flex-1"
          style={{
            backgroundColor: getMainBackgroundColor(),
          }}
        >
          <div className="max-w-[914px] p-0 mt-[2.5rem] mx-auto">
            {<Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
