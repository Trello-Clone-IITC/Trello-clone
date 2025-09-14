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
      <div className="flex-1 flex h-dvh ">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="overflow-y-auto scrollbar pt-0 px-12 pb-14 flex-1 basis-[calc(-320px + 100vw)]"
          style={{
            backgroundColor: getMainBackgroundColor(),
          }}
        >
          <div className="max-w-[914px] p-0 h-full mt-[2.5rem] mx-auto mb-0">
            {<Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
