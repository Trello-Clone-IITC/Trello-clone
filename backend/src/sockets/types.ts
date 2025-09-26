import type { ListDto, CardDto, UpdateCardInput } from "@ronmordo/contracts";

// INTERFACE: Events from server to clients in a board room
export type BoardServerEvents = {
  "list:created": (list: ListDto) => void;
  "list:updated": (list: ListDto) => void;
  "list:deleted": (listId: string) => void;

  "card:created": (card: CardDto) => void;
  "card:updated": (card: CardDto) => void;
  "card:deleted": (cardId: string, listId: string) => void;
  "card:moved": (card: CardDto, fromListId: string | null) => void;
};

// INTERFACE: Events from client to server
export type BoardClientEvents = {
  "board:join": (payload: { boardId: string }) => void;
  "board:leave": (payload: { boardId: string }) => void;
  // Lists CRUD
  "list:create": (payload: {
    boardId: string;
    name: string;
    position?: number;
  }) => void;
  "list:update": (payload: {
    boardId: string;
    listId: string;
    updates: UpdateCardInput;
  }) => void;
  "list:delete": (payload: { boardId: string; listId: string }) => void;
  // Cards CRUD
  "card:create": (payload: {
    boardId: string;
    listId: string;
    title: string;
    position?: number;
  }) => void;
  "card:update": (payload: {
    boardId: string;
    cardId: string;
    updates: UpdateCardInput;
  }) => void;
  "card:delete": (payload: {
    boardId: string;
    cardId: string;
    listId: string;
  }) => void;
  "card:move": (payload: {
    boardId: string;
    cardId: string;
    fromListId: string | null;
    toListId: string | null;
    position: number;
  }) => void;
};
