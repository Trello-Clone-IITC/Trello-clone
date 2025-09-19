import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { ListDto, CardDto } from "@ronmordo/contracts";

// INTERFACE: Event handlers that page/hook can provide
export interface AimansSocketHandlers {
  onListCreated?: (list: ListDto) => void;
  onListUpdated?: (list: ListDto) => void;
  onListDeleted?: (listId: string) => void;
  onCardCreated?: (card: CardDto) => void;
  onCardUpdated?: (card: CardDto) => void;
  onCardDeleted?: (cardId: string, listId: string) => void;
  onCardMoved?: (card: CardDto, fromListId?: string) => void;
}

// Create a singleton socket instance (separate port assumed)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socketInstance: Socket | null = null;
let currentUserId: string | null = null;

const buildAuth = () => (currentUserId ? { userId: currentUserId } : {});

export function getAimansSocket(): Socket {
  if (!socketInstance) {
    // Allow default transports (polling + upgrade) to improve connectivity
    // withCredentials enables cookie-based flows if configured; auth sends userId
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true,
      auth: buildAuth(),
    });
    socketInstance.on("connect_error", (err) => {
      console.warn("Socket connect_error:", (err as any)?.message || err);
    });
    socketInstance.on("error", (err) => {
      console.warn("Socket error:", err);
    });
  }
  return socketInstance;
}

// Update auth payload and reconnect so the server receives latest user id
export function setSocketUserId(userId: string | null) {
  currentUserId = userId;
  const socket = getAimansSocket();
  // update auth for next connect
  (socket as Socket & { auth?: Record<string, unknown> }).auth = buildAuth();
  // force reconnect to resend handshake with new auth
  if (socket.connected) socket.disconnect();
  socket.connect();
}

export function useAimansBoardSocket(
  boardId: string,
  handlers: AimansSocketHandlers
) {
  const socket = getAimansSocket();

  useEffect(() => {
    socket.emit("board:join", { boardId });

    // Lists
    handlers.onListCreated &&
      socket.on("list:created", handlers.onListCreated);
    handlers.onListUpdated &&
      socket.on("list:updated", handlers.onListUpdated);
    handlers.onListDeleted &&
      socket.on("list:deleted", handlers.onListDeleted);

    // Cards
    handlers.onCardCreated &&
      socket.on("card:created", handlers.onCardCreated);
    handlers.onCardUpdated &&
      socket.on("card:updated", handlers.onCardUpdated);
    handlers.onCardDeleted &&
      socket.on("card:deleted", handlers.onCardDeleted);
    handlers.onCardMoved && socket.on("card:moved", handlers.onCardMoved);

    return () => {
      socket.emit("board:leave", { boardId });
      socket.off("list:created");
      socket.off("list:updated");
      socket.off("list:deleted");
      socket.off("card:created");
      socket.off("card:updated");
      socket.off("card:deleted");
      socket.off("card:moved");
    };
  }, [socket, boardId]);
}

// Emit helpers
export const emitCreateList = (
  boardId: string,
  name: string,
  position?: number
) => getAimansSocket().emit("list:create", { boardId, name, position });

export const emitUpdateList = (
  boardId: string,
  listId: string,
  updates: Partial<Pick<ListDto, "name" | "position" | "isArchived" | "subscribed">>
) => getAimansSocket().emit("list:update", { boardId, listId, updates });

export const emitDeleteList = (boardId: string, listId: string) =>
  getAimansSocket().emit("list:delete", { boardId, listId });

export const emitCreateCard = (
  boardId: string,
  listId: string,
  title: string,
  position?: number
) => getAimansSocket().emit("card:create", { boardId, listId, title, position });

export const emitUpdateCard = (
  boardId: string,
  cardId: string,
  updates: Partial<Pick<CardDto, "title" | "description" | "dueDate" | "startDate" | "coverImageUrl">>
) => getAimansSocket().emit("card:update", { boardId, cardId, updates });

export const emitDeleteCard = (
  boardId: string,
  cardId: string,
  listId: string
) => getAimansSocket().emit("card:delete", { boardId, cardId, listId });

export const emitMoveCard = (
  boardId: string,
  cardId: string,
  toListId: string,
  position: number
) => getAimansSocket().emit("card:move", { boardId, cardId, toListId, position });
