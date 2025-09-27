import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Users, ChevronRight } from "lucide-react";

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
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/boards"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
              aria-label="View Boards"
            >
              <LayoutDashboard className="h-4 w-4" />
              View Boards
            </a>
            <a
              href="/templates"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border",
                isLight
                  ? "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                  : "bg-transparent text-white border-white/20 hover:bg-white/10"
              )}
              aria-label="Browse Templates"
            >
              <BookOpen className="h-4 w-4" />
              Browse Templates
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className={cn(
              "group p-6 rounded-lg border transition-all hover:-translate-y-0.5 hover:shadow-lg h-full flex flex-col",
              isLight
                ? "bg-white border-gray-200 hover:ring-1 hover:ring-blue-500/20"
                : "bg-[#2c2c2e] border-gray-700 hover:ring-1 hover:ring-blue-400/20"
            )}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-md flex items-center justify-center mb-4",
                isLight
                  ? "bg-blue-50 text-blue-600"
                  : "bg-blue-500/10 text-blue-400"
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
            </div>
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
                "mt-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              View Boards
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div
            className={cn(
              "group p-6 rounded-lg border transition-all hover:-translate-y-0.5 hover:shadow-lg h-full flex flex-col",
              isLight
                ? "bg-white border-gray-200 hover:ring-1 hover:ring-blue-500/20"
                : "bg-[#2c2c2e] border-gray-700 hover:ring-1 hover:ring-blue-400/20"
            )}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-md flex items-center justify-center mb-4",
                isLight
                  ? "bg-violet-50 text-violet-600"
                  : "bg-violet-500/10 text-violet-400"
              )}
            >
              <BookOpen className="h-5 w-5" />
            </div>
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
                "mt-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              )}
            >
              Browse Templates
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div
            className={cn(
              "group p-6 rounded-lg border transition-all hover:-translate-y-0.5 hover:shadow-lg h-full flex flex-col",
              isLight
                ? "bg-white border-gray-200 hover:ring-1 hover:ring-blue-500/20"
                : "bg-[#2c2c2e] border-gray-700 hover:ring-1 hover:ring-blue-400/20"
            )}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-md flex items-center justify-center mb-4",
                isLight
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-emerald-500/10 text-emerald-400"
              )}
            >
              <Users className="h-5 w-5" />
            </div>
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
                "mt-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isLight
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              Invite Members
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
