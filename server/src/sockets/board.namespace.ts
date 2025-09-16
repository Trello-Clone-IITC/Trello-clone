import type { Server, Socket } from "socket.io";
import type { BoardClientEvents, BoardServerEvents } from "./types.js";
import listService from "../api/lists/list.service.js";
import cardService from "../api/cards/card.service.js";
import { mapListToDto } from "../api/lists/list.mapper.js";
import { mapCardToDto } from "../api/cards/card.mapper.js";
import { emitCardCreated, emitCardDeleted, emitCardMoved, emitCardUpdated, emitListCreated, emitListDeleted, emitListUpdated } from "./emitter.js";

// TODO: DEV USER ID (remove after wiring real auth)
const DEV_USER_ID = "96099bc0-34b7-4be5-b410-4d624cd99da5";

const room = (boardId: string) => `board:${boardId}`;

export function registerBoardNamespace(io: Server<BoardServerEvents, any, BoardClientEvents>) {
  io.on("connection", (socket: Socket<BoardClientEvents, BoardServerEvents>) => {
    socket.on("board:join", ({ boardId }) => {
      socket.join(room(boardId));
    });
    socket.on("board:leave", ({ boardId }) => {
      socket.leave(room(boardId));
    });

    // Lists
    socket.on("list:create", async ({ boardId, name, position }) => {
      try {
        // Decide position when not provided
        let pos = position;
        if (pos === undefined) {
          const lists = await listService.getAllListsByBoard(boardId);
          const last = lists[lists.length - 1];
          pos = last ? Number(last.position) + 1000 : 1000;
        }
        const created = await listService.createList({ name, position: pos }, boardId);
        const dto = mapListToDto(created);
        emitListCreated(boardId, dto);
      } catch (e) {
        // ignore for now or add error channel
      }
    });

    socket.on("list:update", async ({ boardId, listId, updates }) => {
      try {
        const updated = await listService.updateList(listId, updates);
        if (!updated) return;
        const dto = mapListToDto(updated);
        emitListUpdated(boardId, dto);
      } catch (e) {
        // ignore
      }
    });

    socket.on("list:delete", async ({ boardId, listId }) => {
      try {
        const ok = await listService.deleteList(listId);
        if (!ok) return;
        emitListDeleted(boardId, listId);
      } catch (e) {
        // ignore
      }
    });

    // Cards
    socket.on("card:create", async ({ boardId, listId, title, position }) => {
      try {
        const created = await cardService.createCard(
          { title, position: position ?? 1000 },
          listId,
          DEV_USER_ID
        );
        const dto = mapCardToDto(created as any);
        emitCardCreated(boardId, dto);
      } catch (e) {
        // ignore
      }
    });

    socket.on("card:update", async ({ boardId, cardId, updates }) => {
      try {
        const updated = await cardService.updateCard(cardId, {
          title: updates.title,
          description: updates.description ?? undefined,
          dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
          startDate: updates.startDate ? new Date(updates.startDate) : undefined,
          coverImageUrl: updates.coverImageUrl ?? undefined,
        }, DEV_USER_ID);
        const dto = mapCardToDto(updated as any);
        emitCardUpdated(boardId, dto);
      } catch (e) {
        // ignore
      }
    });

    socket.on("card:delete", async ({ boardId, cardId, listId }) => {
      try {
        await cardService.deleteCard(cardId, DEV_USER_ID);
        emitCardDeleted(boardId, cardId, listId);
      } catch (e) {
        // ignore
      }
    });

    socket.on("card:move", async ({ boardId, cardId, toListId, position }) => {
      try {
        // We need fromListId for the client UI to remove from source list; get card first
        const existing = await cardService.getCardById(cardId, DEV_USER_ID);
        const fromListId = (existing as any).listId ?? (existing as any).list?.id;
        const moved = await cardService.moveCard(cardId, toListId, position, DEV_USER_ID);
        const dto = mapCardToDto(moved as any);
        emitCardMoved(boardId, dto, fromListId);
      } catch (e) {
        // ignore
      }
    });
  });
}
