import type { Server, Socket } from "socket.io";
import type { BoardClientEvents, BoardServerEvents } from "./types.js";
import listService from "../api/lists/list.service.js";
import cardService from "../api/cards/card.service.js";
import { mapListToDto } from "../api/lists/list.mapper.js";
import { emitCardCreated, emitCardDeleted, emitCardMoved, emitCardUpdated, emitListCreated, emitListDeleted, emitListUpdated } from "./emitter.js";
import { AppError } from "../utils/appError.js";
import { userService } from "../api/users/user.service.js";

// Helpers to extract Clerk user id from cookies (no Clerk middleware in socket path)
function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  return Buffer.from(padded, "base64").toString("utf8");
}

function getCookieValue(cookieHeader: string | string[] | undefined, name: string): string | undefined {
  const raw = Array.isArray(cookieHeader) ? cookieHeader.join(";") : cookieHeader;
  if (!raw) return undefined;
  const parts = raw.split(";");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = decodeURIComponent(part.slice(0, eq));
    if (k === name || k.startsWith(name + "_")) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return undefined;
}

function getClerkIdFromCookies(cookieHeader: string | string[] | undefined): string | null {
  const token = getCookieValue(cookieHeader, "__session");
  if (!token) return null;
  const segments = token.split(".");
  if (segments.length < 2) return null;
  try {
    const payload = JSON.parse(decodeBase64Url(segments[1])) as { sub?: string };
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

// Resolve app user id for this socket (Clerk -> DB user id) and cache
const getUserId = async (socket: Socket): Promise<string> => {
  const cached = (socket.data as { userId?: unknown }).userId;
  if (typeof cached === "string" && cached.length > 0) return cached;

  const clerkId = getClerkIdFromCookies(socket.request.headers?.cookie);
  console.log("Resolved clerkId from socket cookies:", clerkId);
  
  if (!clerkId) throw new AppError("Unauthenticated socket connection", 401);

  try {
    const appUserId = await userService.getUserIdByClerkId(clerkId);
    console.log("Resolved app userId from clerkId:", appUserId);
    
    (socket.data as { userId?: string }).userId = appUserId;
    return appUserId;
  } catch (err) {
    throw new AppError("Unauthenticated socket connection", 401);
  }
};

const room = (boardId: string) => `board:${boardId}`;

export function registerBoardNamespace(io: Server) {
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
        const userId = await getUserId(socket);
        const created = await cardService.createCard(
          { title, position: position ?? 1000 },
          listId,
          userId
        );
        emitCardCreated(boardId, created);
      } catch (e) {
        // ignore
      }
    });

    socket.on("card:update", async ({ boardId, cardId, updates }) => {
      try {
        const userId = await getUserId(socket);
        const updated = await cardService.updateCard(
          cardId,
          {
            title: updates.title,
            description: updates.description ?? undefined,
            dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
            startDate: updates.startDate ? new Date(updates.startDate) : undefined,
            coverImageUrl: updates.coverImageUrl ?? undefined,
          },
          userId
        );
        emitCardUpdated(boardId, updated);
      } catch (e) {
        // ignore
      }
    });

    socket.on("card:delete", async ({ boardId, cardId, listId }) => {
      try {
        const userId = await getUserId(socket);
        await cardService.deleteCard(cardId, userId);
        emitCardDeleted(boardId, cardId, listId);
      } catch (e) {
        // ignore
      }
    });

    socket.on("card:move", async ({ boardId, cardId, toListId, position }) => {
      try {
        // We need fromListId for the client UI to remove from source list; get card first
        const userId = await getUserId(socket);
        const existing = await cardService.getCardById(cardId, userId);
        const fromListId = existing.listId;
        const moved = await cardService.moveCard(cardId, toListId, position, userId);
        emitCardMoved(boardId, moved, fromListId);
      } catch (e) {
        // ignore
      }
    });
  });
}
