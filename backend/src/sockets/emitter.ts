import type { Server as IOServer } from "socket.io";
import type { BoardServerEvents } from "./types.js";

let ioRef: IOServer<BoardServerEvents, any, any> | null = null;

export const setIo = (io: IOServer<BoardServerEvents>) => {
  ioRef = io;
};

const room = (boardId: string) => `board:${boardId}`;

export const emitListCreated = (
  boardId: string,
  list: Parameters<BoardServerEvents["list:created"]>[0]
) => {
  ioRef?.to(room(boardId)).emit("list:created", list);
};
export const emitListUpdated = (
  boardId: string,
  list: Parameters<BoardServerEvents["list:updated"]>[0]
) => {
  ioRef?.to(room(boardId)).emit("list:updated", list);
};
export const emitListDeleted = (boardId: string, listId: string) => {
  ioRef?.to(room(boardId)).emit("list:deleted", listId);
};

export const emitCardCreated = (
  boardId: string,
  card: Parameters<BoardServerEvents["card:created"]>[0]
) => {
  ioRef?.to(room(boardId)).emit("card:created", card);
};
export const emitCardUpdated = (
  boardId: string,
  card: Parameters<BoardServerEvents["card:updated"]>[0]
) => {
  ioRef?.to(room(boardId)).emit("card:updated", card);
};
export const emitCardDeleted = (
  boardId: string,
  cardId: string,
  listId: string
) => {
  ioRef?.to(room(boardId)).emit("card:deleted", cardId, listId);
};
export const emitCardMoved = (
  boardId: string,
  card: Parameters<BoardServerEvents["card:moved"]>[0],
  fromListId?: string
) => {
  ioRef?.to(room(boardId)).emit("card:moved", card, fromListId);
};
