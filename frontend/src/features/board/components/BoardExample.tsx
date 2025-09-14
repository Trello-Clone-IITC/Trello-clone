import React from "react";
import { useFullBoard } from "../hooks";
import List from "./List/components/List";
import type { List as ListType } from "./List/redux/listSlice";

// Example component showing how to use the full board hook with existing components
export const BoardExample: React.FC = () => {
  const boardId = "97892bc8-4423-49e8-9630-e9c474b6a772";

  // Get full board data with all nested information
  const { data: fullBoard, isLoading, error } = useFullBoard(boardId);

  console.log("fullBoard", fullBoard);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-white text-lg">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-red-400 text-lg">
          Error loading board: {error?.message}
        </div>
      </div>
    );
  }

  if (!fullBoard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-white text-lg">No board data found</div>
      </div>
    );
  }

  // Transform the API data to match the existing component structure
  const transformedLists: ListType[] =
    fullBoard.lists?.map((list) => ({
      id: list.id,
      title: list.name,
      boardId: fullBoard.id,
      position: list.position,
      cards:
        list.cards?.map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description || undefined,
          listId: list.id,
          position: card.position,
          labels: [], // Cards in BoardFullDto don't have labels, they're separate
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        })) || [],
      createdAt: new Date().toISOString(), // Use current time since API doesn't provide this
      updatedAt: new Date().toISOString(), // Use current time since API doesn't provide this
    })) || [];

  return (
    <div className="min-h-screen bg-[#1d2125]">
      {/* Board Header */}
      <div className="bg-[#1d2125] border-b border-[#2d363c] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {fullBoard.name}
            </h1>
            {fullBoard.description && (
              <p className="text-sm text-[#b6c2cf] mt-1">
                {fullBoard.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-[#b6c2cf]">
            <span>Members: {fullBoard.members?.length || 0}</span>
            <span>Labels: {fullBoard.labels?.length || 0}</span>
            <span>Lists: {fullBoard.lists?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Board Content - Using existing List components */}
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-80px)]">
        {transformedLists.map((list) => (
          <List
            key={list.id}
            id={list.id}
            title={list.title}
            cards={list.cards}
          />
        ))}

        {/* Add new list button */}
        <div className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 h-fit">
          <button className="w-full text-left text-[#b6c2cf] hover:bg-[#282f27] rounded p-2 transition-colors">
            + Add another list
          </button>
        </div>
      </div>
    </div>
  );
};
