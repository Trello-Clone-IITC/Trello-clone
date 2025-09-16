import http from "http";
import { Server } from "socket.io";
import { registerBoardNamespace } from "./sockets/board.namespace.js";
import { setIo } from "./sockets/emitter.js";
import type { BoardServerEvents } from "./sockets/types.js";

const PORT = Number(process.env.SOCKET_PORT || 3100);

const server = http.createServer();
const io: Server<BoardServerEvents> = new Server(server, {
  cors: { origin: "*" },
});

setIo(io);
registerBoardNamespace(io);

server.listen(PORT, () => {
  console.log(`Aiman Socket.IO server listening on :${PORT}`);
});

