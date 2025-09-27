import React from "react";
import { Navbar } from "@/features/navbar";

export const DashboardLoadingSkeleton: React.FC<{ showNavbar?: boolean }> = ({
  showNavbar = true,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {showNavbar && (
        <div
          className="navbar-faded pointer-events-none select-none"
          aria-hidden
        >
          <Navbar />
        </div>
      )}

      {/* Center pipes */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="flex items-start gap-2 h-16">
          <div className="w-2 rounded-full bg-gray-300 dark:bg-[#4c4d51] pulse-forward" />
          <div className="w-2 rounded-full bg-gray-300 dark:bg-[#4c4d51] pulse-reverse" />
          <div className="w-2 rounded-full bg-gray-300 dark:bg-[#4c4d51] pulse-forward" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLoadingSkeleton;
