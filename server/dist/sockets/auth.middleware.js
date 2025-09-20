import { verifyJwt } from "@clerk/backend/jwt";
import { env } from "../config/env.js";
import cookie from "cookie";
const { CLERK_JWT_KEY } = env;
export const authenticateSocket = async (socket, next) => {
    try {
        const cookies = cookie.parse(socket.request.headers.cookie || "");
        console.log("cookies:", cookies);
        const sessionToken = cookies.__session; // Clerk cookie name
        if (!sessionToken) {
            return next(new Error("No Clerk session cookie"));
        }
        // Verify Clerk session
        console.log("My key", CLERK_JWT_KEY);
        const payload = await verifyJwt(sessionToken, { key: CLERK_JWT_KEY });
        // Attach user to socket
        socket.data.auth = { userId: payload.sub };
        next();
    }
    catch (err) {
        console.error("❌ Socket.IO auth failed:", err);
        next(new Error("Unauthorized"));
    }
};
