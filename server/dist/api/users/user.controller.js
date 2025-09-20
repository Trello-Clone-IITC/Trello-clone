import { getAuth } from "@clerk/express";
import { userService } from "./user.service.js";
import workspaceService from "../workspaces/workspace.service.js";
const getMe = async (req, res, next) => {
    try {
        console.log("GetMe request :", req);
        const { userId } = getAuth(req);
        // Since we are protected by validation middleware we can assume safely that userId does exists on req object.
        const user = await userService.getMe(userId);
        return res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
const getAllWorkspaces = async (req, res, next) => {
    try {
        const userId = (await userService.getUserIdByRequest(req)) || "";
        const workspaces = await workspaceService.getWorkspacesByUser(userId);
        return res.status(200).json({
            success: true,
            data: workspaces,
        });
    }
    catch (error) {
        return next(error);
    }
};
export const usersController = { getMe, getAllWorkspaces };
