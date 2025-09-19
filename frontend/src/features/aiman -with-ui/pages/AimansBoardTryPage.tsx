import React from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board";
import { CardModalProvider } from "../components/card/hooks/useCardModal";
import { useAimansBoardRealtime } from "../hooks/useAimansBoard";

export function AimansBoardTryPage() {
  const { boardId = "" } = useParams<{ boardId: string }>();

  // Wire realtime updates for this board
  if (boardId) {
    useAimansBoardRealtime(boardId);
  }

  return (
    <CardModalProvider>
      <Board />
    </CardModalProvider>
  );
}

