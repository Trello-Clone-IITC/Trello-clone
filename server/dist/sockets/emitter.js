let ioRef = null;
export const setIo = (io) => {
    ioRef = io;
};
const room = (boardId) => `board:${boardId}`;
export const emitListCreated = (boardId, list) => {
    ioRef?.to(room(boardId)).emit("list:created", list);
};
export const emitListUpdated = (boardId, list) => {
    ioRef?.to(room(boardId)).emit("list:updated", list);
};
export const emitListDeleted = (boardId, listId) => {
    ioRef?.to(room(boardId)).emit("list:deleted", listId);
};
export const emitCardCreated = (boardId, card) => {
    ioRef?.to(room(boardId)).emit("card:created", card);
};
export const emitCardUpdated = (boardId, card) => {
    ioRef?.to(room(boardId)).emit("card:updated", card);
};
export const emitCardDeleted = (boardId, cardId, listId) => {
    ioRef?.to(room(boardId)).emit("card:deleted", cardId, listId);
};
export const emitCardMoved = (boardId, card, fromListId) => {
    ioRef?.to(room(boardId)).emit("card:moved", card, fromListId);
};
