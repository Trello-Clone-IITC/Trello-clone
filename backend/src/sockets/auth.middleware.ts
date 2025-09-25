import { verifyJwt } from "@clerk/backend/jwt";
import { env } from "../config/env.js";
import cookie from "cookie";
import type { DefaultEventsMap, ExtendedError, Socket } from "socket.io";
import type { BoardServerEvents } from "./types.js";

const { CLERK_JWT_KEY } = env;

export const authenticateSocket = async (
  socket: Socket<BoardServerEvents, BoardServerEvents, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie || "");

    const sessionToken = cookies.__session; // Clerk cookie name

    if (!sessionToken) {
      return next(new Error("No Clerk session cookie"));
    }

    const payload = await verifyJwt(sessionToken, { key: CLERK_JWT_KEY });

    // Attach user to socket
    socket.data.auth = { userId: payload.sub };
    next();
  } catch (err) {
    console.error("❌ Socket.IO auth failed:", err);
    next(new Error("Unauthorized"));
  }
};
