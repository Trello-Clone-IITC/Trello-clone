import React from "react";
import { useAimansBoard } from "../hooks/useAimansBoard";
import { AimansBoard } from "../components/AimansBoard";

// Same board ID used in BoardExample
const BOARD_ID = "97892bc8-4423-49e8-9630-e9c474b6a772";

export function AimansBoardTryPage() {
  const { data, isLoading, error } = useAimansBoard(BOARD_ID);

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
          Error loading board: {(error as Error)?.message}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-white text-lg">No board data found</div>
      </div>
    );
  }

  return <AimansBoard data={data} />;
}

