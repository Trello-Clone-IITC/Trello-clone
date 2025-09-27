import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { aiApi, type AIChatRequest, type AIChatResponse } from "../api";

export const useAIChat = (boardId?: string) => {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      functionCalls?: any[];
      timestamp: Date;
    }>
  >([]);

  const chatMutation = useMutation({
    mutationFn: (data: AIChatRequest) => aiApi.chat(data),
    onSuccess: (data: AIChatResponse) => {
      const newMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: data.response,
        functionCalls: data.functionCalls,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error("AI Chat Error:", error);
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const sendMessage = (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    chatMutation.mutate({
      message,
      boardId,
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
  };
};

export const useAvailableFunctions = () => {
  return useQuery({
    queryKey: ["ai-functions"],
    queryFn: () => aiApi.getAvailableFunctions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
