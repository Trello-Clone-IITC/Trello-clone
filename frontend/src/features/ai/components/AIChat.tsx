import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Sparkles, Check, X } from "lucide-react";
import { useAIChat } from "../hooks/useAIChat";
import { format } from "date-fns";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1f1f21] rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
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
            messages.map((message) => (
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
                  {message.functionCalls &&
                    message.functionCalls.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-start flex-col items-start">
                        <div className="text-xs text-gray-500 mb-1">
                          Actions performed:
                        </div>
                        {message.functionCalls.map((call, index) => (
                          <div
                            key={index}
                            className="text-xs bg-gray-200 dark:bg-[#1f1f21] rounded p-2 flex justify-start mb-1 gap-1"
                          >
                            <span className="font-medium">{call.name}</span>
                            {call.result.success ? (
                              <span className="text-green-600 dark:text-green-400">
                                <Check className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="text-red-600 dark:text-red-400">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  <div className="text-xs opacity-70 mt-1 text-gray-500 dark:text-gray-400">
                    {format(message.timestamp, "HH:mm")}
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="p-2 bg-gray-100 dark:bg-blue-500/10  rounded-lg h-fit">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-600" />
                  </div>
                )}
              </div>
            ))
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
    </div>
  );
};
