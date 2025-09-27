import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../../utils/globalTypes.js";
import { AIService } from "./ai.service.js";
import { userService } from "../users/user.service.js";

const chat = async (
  req: Request<{}, {}, { message: string; boardId?: string }>,
  res: Response<ApiResponse<{ response: string; functionCalls?: any[] }>>,
  next: NextFunction
) => {
  try {
    // Set a longer timeout for AI operations (2 minutes)
    req.setTimeout(120000);
    res.setTimeout(120000);

    const { message, boardId } = req.body;
    const userId = await userService.getUserIdByRequest(req);

    const result = await AIService.processMessage(message, userId, boardId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("AI Chat Error:", err);
    return next(err);
  }
};

const getAvailableFunctions = async (
  _req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  try {
    const functions = AIService.getAvailableFunctions();
    return res.status(200).json({
      success: true,
      data: functions,
    });
  } catch (err) {
    return next(err);
  }
};

export const aiController = {
  chat,
  getAvailableFunctions,
};
