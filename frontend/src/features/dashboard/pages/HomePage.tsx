import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={cn("flex-1 p-6", isLight ? "bg-gray-50" : "bg-[#1f1f21]")}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1
            className={cn(
              "text-3xl font-bold mb-2",
              isLight ? "text-gray-900" : "text-white"
            )}
          >
            Welcome to Trello
          </h1>
          <p
            className={cn(
              "text-lg",
              isLight ? "text-gray-600" : "text-gray-300"
            )}
          >
            Organize your projects and collaborate with your team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className={cn(
              "p-6 rounded-lg border",
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#2c2c2e] border-gray-700"
            )}
          >
            <h3
              className={cn(
                "text-xl font-semibold mb-3",
                isLight ? "text-gray-900" : "text-white"
              )}
            >
              Quick Start
            </h3>
            <p
              className={cn(
                "text-sm mb-4",
                isLight ? "text-gray-600" : "text-gray-300"
              )}
            >
              Get started by creating your first board and organizing your
              tasks.
            </p>
            <a
              href="/boards"
              className={cn(
                "inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              View Boards
            </a>
          </div>

          <div
            className={cn(
              "p-6 rounded-lg border",
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#2c2c2e] border-gray-700"
            )}
          >
            <h3
              className={cn(
                "text-xl font-semibold mb-3",
                isLight ? "text-gray-900" : "text-white"
              )}
            >
              Templates
            </h3>
            <p
              className={cn(
                "text-sm mb-4",
                isLight ? "text-gray-600" : "text-gray-300"
              )}
            >
              Use pre-built templates to quickly set up common project
              workflows.
            </p>
            <a
              href="/templates"
              className={cn(
                "inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              )}
            >
              Browse Templates
            </a>
          </div>

          <div
            className={cn(
              "p-6 rounded-lg border",
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#2c2c2e] border-gray-700"
            )}
          >
            <h3
              className={cn(
                "text-xl font-semibold mb-3",
                isLight ? "text-gray-900" : "text-white"
              )}
            >
              Team Collaboration
            </h3>
            <p
              className={cn(
                "text-sm mb-4",
                isLight ? "text-gray-600" : "text-gray-300"
              )}
            >
              Invite team members and work together on shared boards and
              projects.
            </p>
            <button
              className={cn(
                "inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              Invite Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
