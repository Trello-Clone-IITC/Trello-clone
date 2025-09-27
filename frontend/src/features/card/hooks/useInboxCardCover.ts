import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axiosInstance";
import type { ApiResponse, CardDto } from "@/shared/types/apiResponse";

export const isHexColor = (val: string) =>
  /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(val);

export type UseInboxCardCover = {
  value: string | null;
  setColor: (hex: string) => void;
  setImage: (url: string) => void;
  clear: () => void;
  isHexColor: (val: string) => boolean;
};

export function useInboxCardCover(
  cardId: string,
  initial?: string | null
): UseInboxCardCover {
  const [value, setValue] = useState<string | null>(initial ?? null);
  const queryClient = useQueryClient();

  const updateCardMutation = useMutation({
    mutationFn: async (updates: { coverImageUrl: string | null }) => {
      const response = await api.patch<ApiResponse<CardDto>>(
        `/cards/${cardId}`,
        updates
      );
      return response.data.data;
    },
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["inbox-cards"] });

      // Snapshot the previous value
      const previousCards = queryClient.getQueryData<CardDto[]>([
        "inbox-cards",
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<CardDto[] | undefined>(
        ["inbox-cards"],
        (old) => {
          if (!old) return old;
          return old.map((card) =>
            card.id === cardId ? { ...card, ...updates } : card
          );
        }
      );

      return { previousCards };
    },
    onError: (err, updates, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCards) {
        queryClient.setQueryData(["inbox-cards"], context.previousCards);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["inbox-cards"] });
    },
  });

  const setColor = (hex: string) => {
    setValue(hex);
    updateCardMutation.mutate({ coverImageUrl: hex });
  };

  const setImage = (url: string) => {
    setValue(url);
    updateCardMutation.mutate({ coverImageUrl: url });
  };

  const clear = () => {
    setValue(null);
    updateCardMutation.mutate({ coverImageUrl: null });
  };

  return useMemo(
    () => ({ value, setColor, setImage, clear, isHexColor }),
    [value]
  );
}
