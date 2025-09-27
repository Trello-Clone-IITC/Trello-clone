import { useState, useMemo } from "react";
import { useUpdateCard } from "./useCardMutations";

export const isHexColor = (val: string) =>
  /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(val);

export type UseCardCover = {
  value: string | null;
  setColor: (hex: string) => void;
  setImage: (url: string) => void;
  clear: () => void;
  isHexColor: (val: string) => boolean;
};

export function useCardCover(
  boardId: string,
  listId: string,
  cardId: string,
  initial?: string | null
): UseCardCover {
  const [value, setValue] = useState<string | null>(initial ?? null);
  const updateCardMut = useUpdateCard(boardId, listId, cardId);

  const setColor = (hex: string) => {
    setValue(hex);
    updateCardMut.mutate({ coverImageUrl: hex });
  };

  const setImage = (url: string) => {
    setValue(url);
    updateCardMut.mutate({ coverImageUrl: url });
  };

  const clear = () => {
    setValue(null);
    updateCardMut.mutate({ coverImageUrl: null });
  };

  return useMemo(
    () => ({ value, setColor, setImage, clear, isHexColor }),
    [value]
  );
}

