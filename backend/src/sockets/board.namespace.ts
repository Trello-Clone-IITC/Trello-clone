import type { Server, Socket } from "socket.io";
import type { BoardClientEvents, BoardServerEvents } from "./types.js";
import listService from "../api/lists/list.service.js";
import cardService from "../api/cards/card.service.js";
import {
  emitCardCreated,
  emitCardDeleted,
  emitCardMoved,
  emitCardUpdated,
  emitListCreated,
  emitListDeleted,
  emitListUpdated,
} from "./emitter.js";
import { userService } from "../api/users/user.service.js";

// Derive user id per socket (fallback to dev user until auth is wired)
// const DEV_USER_ID = "96099bc0-34b7-4be5-b410-4d624cd99da5";
// const getUserId = (socket: Socket): string => {
//   // Fast-path: try auth payload first
//   const auth: any = socket.handshake?.auth as any;
//   const headers: Record<string, any> = (socket.handshake as any)?.headers || {};

//   let uid: string | undefined =
//     auth?.userId ||
//     auth?.user_id ||
//     auth?.uid ||
//     (socket.handshake as any)?.query?.userId ||
//     headers["x-user-id"] ||
//     headers["x-userid"] ||
//     headers["x-uid"];

//   // Parse cookies if still not found
//   if (!uid) {
//     const cookieHeader = headers?.cookie as string | undefined;
//     if (cookieHeader) {
//       // Minimal cookie parser (no allocations beyond split/join)
//       const pairs = cookieHeader.split(";");
//       for (let i = 0; i < pairs.length; i++) {
//         const part = pairs[i].trim();
//         const eqIdx = part.indexOf("=");
//         if (eqIdx === -1) continue;
//         const key = decodeURIComponent(part.slice(0, eqIdx));
//         const val = decodeURIComponent(part.slice(eqIdx + 1));
//         if (
//           key === "userId" ||
//           key === "user_id" ||
//           key === "uid" ||
//           key === "x-user-id"
//         ) {
//           uid = val;
//           break;
//         }
//       }
//     }
//   }
//   if (!uid) throw new Error("User ID not found in socket handshake");
//   return uid;
// };

const room = (boardId: string) => `board:${boardId}`;

export function registerBoardNamespace(io: Server) {
  io.on(
    "connection",
    (socket: Socket<BoardClientEvents, BoardServerEvents>) => {
      socket.on("board:join", ({ boardId }) => {
        socket.join(room(boardId));
      });
      socket.on("board:leave", ({ boardId }) => {
        socket.leave(room(boardId));
      });

      // Lists
      socket.on("list:create", async ({ boardId, name }) => {
        try {
          // const userId = await userService.getUserIdByClerkId(
          //   socket.data.auth.userId
          // );
          // console.log("userId:", userId);

          const listDto = await listService.createList({ name }, boardId);
          emitListCreated(boardId, listDto);
        } catch (e) {
          // ignore for now or add error channel
        }
      });

      socket.on("list:update", async ({ boardId, listId, updates }) => {
        try {
          const updatedListDto = await listService.updateList(listId, updates);
          emitListUpdated(boardId, updatedListDto);
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
      socket.on("card:create", async ({ boardId, listId, title }) => {
        try {
          // const userId = getUserId(socket);
          const userId = await userService.getUserIdByClerkId(
            socket.data.auth.userId
          );
          // console.log("userId:", userId);

          const created = await cardService.createCard(
            { title },
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
          // const userId = getUserId(socket);
          const userId = await userService.getUserIdByClerkId(
            socket.data.auth.userId
          );
          // console.log("userId:", userId);

          const updated = await cardService.updateCard(cardId, updates, userId);
          emitCardUpdated(boardId, updated);
        } catch (e) {
          // ignore
        }
      });

      socket.on("card:delete", async ({ boardId, cardId, listId }) => {
        try {
          // const userId = getUserId(socket);

          const userId = await userService.getUserIdByClerkId(
            socket.data.auth.userId
          );
          // console.log("userId:", userId);
          await cardService.deleteCard(cardId, userId);
          emitCardDeleted(boardId, cardId, listId);
        } catch (e) {
          // ignore
        }
      });

      socket.on(
        "card:move",
        async ({ boardId, cardId, fromListId, toListId, position }) => {
          try {
            // We need fromListId for the client UI to remove from source list; get card first
            // const userId = getUserId(socket);

            const userId = await userService.getUserIdByClerkId(
              socket.data.auth.userId
            );

            const moved = await cardService.updateCard(
              cardId,
              { listId: toListId, position },
              userId
            );
            emitCardMoved(boardId, moved, fromListId);
          } catch (e) {
            // ignore
          }
        }
      );
    }
  );
}
