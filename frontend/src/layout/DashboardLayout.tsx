import { Navbar } from "@/features/navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "#1d2125" }}
        >
          <div className="p-3 md:p-6">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
