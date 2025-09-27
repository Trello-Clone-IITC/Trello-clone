import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Trash2, Sparkles } from "lucide-react";
import { useAIChat } from "../hooks/useAIChat";
import { format } from "date-fns";
import { useUser } from "@clerk/clerk-react";
import type { CardDto } from "@ronmordo/contracts";
import CardModal from "@/features/card/components/CardModal";
import { useTheme } from "@/hooks/useTheme";
import {
  getLabelColorClass,
  toBoldLabelColorName,
  getLabelColor,
  isValidLabelColor,
} from "@/shared/constants";
import { BoardCard } from "@/features/dashboard/components/BoardCard";
import { getBackgroundPreviewUrl } from "@/features/board/utils/backgroundUtils";
import type { BoardDto } from "@ronmordo/contracts";

interface AIChatProps {
  boardId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ boardId, isOpen, onClose }) => {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, sendMessage, clearMessages, isLoading } =
    useAIChat(boardId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [previewCard, setPreviewCard] = useState<CardDto | null>(null);
  const [openCardModal, setOpenCardModal] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Extract a list preview (list + cards) from assistant function call results
  type AssistantMessage = {
    role: "user" | "assistant";
    content: string;
    functionCalls?: Array<{
      name: string;
      arguments: unknown;
      result: unknown;
    }>;
  };

  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const getProp = <T,>(obj: unknown, key: string): T | undefined => {
    if (!isObject(obj)) return undefined;
    if (!(key in obj)) return undefined;
    return obj[key] as T;
  };

  const isHexColor = (value?: string | null): boolean => {
    if (!value) return false;
    const v = value.trim();
    return /^(#)?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
      v
    );
  };

  const normalizeHex = (value: string): string =>
    value.startsWith("#") ? value : `#${value}`;

  const getLabelClassName = (color: string) => {
    const effectiveColor = isLight ? toBoldLabelColorName(color) : color;
    return getLabelColorClass(effectiveColor);
  };

  const getLabelTextColorHex = (color: string): string => {
    if (!color) return getLabelColor("default");
    const base = color.replace(/^bold_/, "").replace(/^subtle_/, "");
    const regular = base;
    const subtle = `subtle_${base}`;
    if (isValidLabelColor(regular)) return getLabelColor(regular);
    if (isValidLabelColor(subtle)) return getLabelColor(subtle);
    return getLabelColor(color);
  };

  const getAssistantPreview = (message: AssistantMessage) => {
    if (message.role !== "assistant" || !message.functionCalls?.length)
      return null;

    let list: { id?: string; name?: string } | null = null;
    const cards: CardDto[] = [];
    const boards: BoardDto[] = [];
    let inferredTitle: string | null = null;

    for (const call of message.functionCalls) {
      const name: string = call?.name;
      const result = call?.result as unknown;
      const args = call?.arguments as unknown;
      const success = getProp<boolean>(result, "success");
      if (success === false) continue;

      const resultList = getProp<unknown>(result, "list");
      if (!list && isObject(resultList)) {
        // createList / updateList
        list = {
          id: getProp<string>(resultList, "id"),
          name: getProp<string>(resultList, "name"),
        };
      }
      // Any single-card returning function (createCard, updateCard, etc.)
      const singleCard = getProp<CardDto>(result, "card");
      if (singleCard) cards.push(singleCard);

      // Any single-board returning function (createBoard, updateBoard, etc.)
      const singleBoard = getProp<BoardDto>(result, "board");
      if (singleBoard) boards.push(singleBoard);

      // Infer title from arguments if present
      const argTitle = getProp<string>(args, "title");
      if (!inferredTitle && typeof argTitle === "string" && argTitle.trim()) {
        inferredTitle = argTitle.trim();
      }
      const argCards = getProp<unknown[]>(args, "cards");
      if (!inferredTitle && Array.isArray(argCards) && argCards.length > 0) {
        const first = argCards[0] as Record<string, unknown> | undefined;
        const t = first ? (first["title"] as string | undefined) : undefined;
        if (t && t.trim()) inferredTitle = t.trim();
      }

      // Bulk results array with cards (e.g., createMultipleCards)
      if (name === "createMultipleCards") {
        const resultsArr = getProp<unknown[]>(result, "results");
        if (Array.isArray(resultsArr)) {
          for (const r of resultsArr) {
            const rSuccess = getProp<boolean>(r, "success");
            const rCard = getProp<CardDto>(r, "card");
            if (rSuccess && rCard) cards.push(rCard);
          }
        }
      }

      // Direct "cards" array in result
      const directCards = getProp<CardDto[]>(result, "cards");
      if (Array.isArray(directCards)) {
        for (const dc of directCards) {
          if (dc && dc.id) cards.push(dc);
        }
      }
    }

    // Fallback: infer list from any card
    if (!list && cards.length > 0) {
      list = { id: cards[0].listId as string | undefined, name: undefined };
    }

    if (!list && !cards.length && boards.length === 0) return null;
    if (!inferredTitle && cards.length > 0 && cards[0].title) {
      inferredTitle = cards[0].title as string;
    }
    return { list, cards, boards, inferredTitle } as {
      list: { id?: string; name?: string } | null;
      cards: CardDto[];
      boards: BoardDto[];
      inferredTitle?: string | null;
    };
  };

  // Removed generic builder: we now show the real created card

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 board-scrollbar">
      <div className="bg-white dark:bg-[#1f1f21] rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-[#2c2c2e] rounded-lg">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {boardId ? "Board Assistant" : "General Assistant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearMessages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              X
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-blue-100 dark:bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to AI Assistant
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                I can help you manage your boards, create cards, organize lists,
                and more!
              </p>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                <p>Try saying:</p>
                <ul className="mt-2 space-y-1">
                  <li>• "Create a new card called 'Review design'"</li>
                  <li>• "Show me all cards in this board"</li>
                  <li>• "Move the first card to the Done list"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const preview = getAssistantPreview(message);
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="p-2 bg-blue-100 dark:bg-[#2c2c2e] rounded-lg flex-shrink-0 h-fit">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-[#2c2c2e] text-gray-900 dark:text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {preview && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Preview
                        </div>
                        <div className="flex flex-col gap-3">
                          {/* Board preview when assistant creates/updates a board */}
                          {preview.boards && preview.boards.length > 0 && (
                            <div className="w-[215px]">
                              <BoardCard
                                id={preview.boards[0].id}
                                title={preview.boards[0].name}
                                backgroundImage={
                                  getBackgroundPreviewUrl(
                                    preview.boards[0].background
                                  ) || "/images/background-1-hd.webp"
                                }
                                useRandomImage={false}
                                onClick={() => {
                                  const bid = preview.boards?.[0]?.id;
                                  if (!bid) return;
                                  window.location.assign(`/b/${bid}`);
                                }}
                              />
                            </div>
                          )}
                          {/* Card previews */}
                          {preview.cards.length === 0 ? (
                            <div className="text-xs text-gray-500 px-2 py-2">
                              No cards
                            </div>
                          ) : (
                            preview.cards.map((c) => (
                              <div key={c.id} className="w-[272px]">
                                <div
                                  className="group relative min-h-[36px] rounded-[8px] cursor-pointer shadow-sm transition-colors border border-gray-200 dark:border-gray-700"
                                  onClick={() => {
                                    setPreviewCard(c);
                                    setOpenCardModal(true);
                                  }}
                                  style={{
                                    backgroundColor: "#1f1f21",
                                    marginTop: "2px",
                                    marginBottom: "2px",
                                  }}
                                >
                                  {c.coverImageUrl ? (
                                    isHexColor(c.coverImageUrl) ? (
                                      <div
                                        className="h-16 overflow-hidden rounded-t-[8px]"
                                        style={{
                                          backgroundColor: normalizeHex(
                                            c.coverImageUrl.trim()
                                          ),
                                        }}
                                      />
                                    ) : (
                                      <div className="h-16 overflow-hidden rounded-t-[8px]">
                                        <img
                                          src={c.coverImageUrl}
                                          alt=""
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      </div>
                                    )
                                  ) : null}
                                  <div className="z-10 min-h-[24px] px-3 pt-2 pb-2">
                                    {(() => {
                                      const labels = (c.labels || []).slice(
                                        0,
                                        2
                                      );
                                      while (labels.length < 2) {
                                        labels.push({
                                          // minimal shape for preview
                                          name:
                                            labels.length === 0
                                              ? "Label A"
                                              : "Label B",
                                          color: (labels.length === 0
                                            ? "bold_blue"
                                            : "bold_green") as unknown as string,
                                        } as unknown as (typeof labels)[number]);
                                      }
                                      return (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {labels.map((label, index) => (
                                            <span
                                              key={
                                                label.name || `label-${index}`
                                              }
                                              className={`h-4 px-2 py-0 my-0 rounded-[4px] text-[10px] font-normal overflow-hidden ${getLabelClassName(
                                                label.color as string
                                              )}`}
                                              style={{
                                                color: getLabelTextColorHex(
                                                  label.color as string
                                                ),
                                              }}
                                              title={label.name || ""}
                                            >
                                              {label.name || ""}
                                            </span>
                                          ))}
                                        </div>
                                      );
                                    })()}
                                    <h3 className="font-medium text-white text-sm leading-tight">
                                      {preview?.inferredTitle?.trim() ||
                                        c.title?.trim() ||
                                        "Generic Title"}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    {/* Removed 'Actions performed' section for cleaner UI */}
                    <div className="text-xs opacity-70 mt-1 text-gray-500 dark:text-gray-400">
                      {format(message.timestamp, "HH:mm")}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="p-2 bg-gray-100 dark:bg-blue-500/10  rounded-lg h-fit">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || user.username || "user"}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                          {(user?.fullName || user?.username || "?")
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex-shrink-0 h-fit">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-gray-100 dark:bg-[#2c2c2e] rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to help with your board..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      {boardId && previewCard && (
        <CardModal
          open={openCardModal}
          onClose={() => setOpenCardModal(false)}
          boardId={boardId}
          card={previewCard}
          isCompleted={previewCard.isCompleted}
          onComplete={() => {}}
          isInbox={true}
        />
      )}
    </div>
  );
};
