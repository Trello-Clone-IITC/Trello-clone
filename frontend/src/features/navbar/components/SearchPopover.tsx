import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchResultsDto } from "@ronmordo/contracts";
import { getBackgroundPreviewUrl } from "@/features/dashboard/utils/backgroundUtils";

interface SearchPopoverProps {
  searchResults: SearchResultsDto | undefined;
  isLoading: boolean;
  searchValue: string;
}

export default function SearchPopover({
  searchResults,
  isLoading,
  searchValue,
}: SearchPopoverProps) {
  const [activeTab, setActiveTab] = useState<"trello" | "confluence">("trello");

  // For now, show empty recent boards until we implement the proper API
  const recentBoards: Array<{
    id: string;
    name: string;
    workspace: string;
    background: string;
  }> = [];

  const hasSearchResults =
    searchValue &&
    searchResults &&
    ((searchResults.boards && searchResults.boards.length > 0) ||
      (searchResults.cards && searchResults.cards.length > 0) ||
      (searchResults.users && searchResults.users.length > 0));

  return (
    <div
      className="w-[780px] bg-[#2b2c2f] rounded-[8px] shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tabs */}
      <div className="flex border-b border-[#8c8f97]">
        <button
          onClick={() => setActiveTab("trello")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "trello"
              ? "text-[#85b8ff] border-[#85b8ff]"
              : "text-[#8c8f97] border-transparent hover:text-white"
          )}
        >
          Trello
        </button>
        <button
          onClick={() => setActiveTab("confluence")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "confluence"
              ? "text-[#85b8ff] border-[#85b8ff]"
              : "text-[#8c8f97] border-transparent hover:text-white"
          )}
        >
          Confluence
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {!searchValue ? (
          // Show recent boards when no search
          <div className="p-4">
            <h3 className="text-xs font-semibold text-[#8c8f97] uppercase tracking-wide mb-3">
              RECENT BOARDS
            </h3>
            {recentBoards.length > 0 ? (
              <div className="space-y-1">
                {recentBoards.map((board) => (
                  <div
                    key={board.id}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-[#626468] cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-gray-300 flex-shrink-0 overflow-hidden">
                      <img
                        src={board.background}
                        alt={board.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {board.name}
                      </p>
                      <p className="text-[#8c8f97] text-xs truncate">
                        {board.workspace}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#8c8f97] text-sm">No recent boards</p>
              </div>
            )}
          </div>
        ) : (
          // Show search results
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#85b8ff]"></div>
              </div>
            ) : hasSearchResults ? (
              <div className="space-y-4">
                {/* Boards */}
                {searchResults.boards && searchResults.boards.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-[#8c8f97] uppercase tracking-wide mb-3">
                      BOARDS ({searchResults.boards.length})
                    </h3>
                    <div className="space-y-1">
                      {searchResults.boards.map((board) => (
                        <div
                          key={board.id}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-[#626468] cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-gray-300 flex-shrink-0 overflow-hidden">
                            {(() => {
                              const backgroundUrl = getBackgroundPreviewUrl(
                                board.background
                              );
                              return backgroundUrl ? (
                                <img
                                  src={backgroundUrl}
                                  alt={board.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {board.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {board.name}
                            </p>
                            <p className="text-[#8c8f97] text-xs truncate">
                              {board.workspace.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cards */}
                {searchResults.cards && searchResults.cards.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-[#8c8f97] uppercase tracking-wide mb-3">
                      CARDS
                    </h3>
                    <div className="space-y-1">
                      {searchResults.cards.map((card, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-[#626468] cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-gray-300 flex-shrink-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-[#85b8ff] rounded"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {card.title}
                            </p>
                            <p className="text-[#8c8f97] text-xs truncate">
                              {card.list?.board.name} •{" "}
                              {card.list?.board.workspace.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users */}
                {searchResults.users && searchResults.users.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-[#8c8f97] uppercase tracking-wide mb-3">
                      USERS
                    </h3>
                    <div className="space-y-1">
                      {searchResults.users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-[#626468] cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#85b8ff] flex items-center justify-center text-white text-xs font-medium">
                                {user.fullName?.charAt(0) ||
                                  user.username?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {user.fullName || user.username}
                            </p>
                            <p className="text-[#8c8f97] text-xs truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#8c8f97] text-sm">No results found</p>
              </div>
            )}
          </div>
        )}

        {/* Advanced search */}
        <div className="border-t border-[#8c8f97] p-4">
          <div className="flex items-center space-x-3 p-2 rounded hover:bg-[#626468] cursor-pointer transition-colors">
            <Search className="h-4 w-4 text-[#8c8f97]" />
            <span className="text-white text-sm">Advanced search</span>
            <ArrowLeft className="h-4 w-4 text-[#8c8f97] ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
