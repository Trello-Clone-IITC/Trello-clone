import React, { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { AIChat } from "./AIChat";

interface AIButtonProps {
  boardId?: string;
  className?: string;
  variant?: "default" | "floating";
}

export const AIButton: React.FC<AIButtonProps> = ({
  boardId,
  className = "",
  variant = "default",
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (variant === "floating") {
    return (
      <>
        <button
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-6 right-6 z-40 p-4 bg-[#0a0d12] hover:bg-[#2b2c2f] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ${className}`}
          title="Open AI Assistant"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">AI Assistant</span>
        </button>
        <AIChat
          boardId={boardId}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
      >
        <Sparkles className="w-4 h-4" />
        AI Assistant
      </button>
      <AIChat
        boardId={boardId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};
