import type { Request, Response, NextFunction } from "express";
import { userService } from "../users/user.service.js";
import type { ApiResponse } from "../../utils/globalTypes.js";
import type { CardDto, CardIdParam } from "@ronmordo/contracts";
import cardService from "../cards/card.service.js";

const getInboxCards = async (
  req: Request,
  res: Response<ApiResponse<CardDto[]>>,
  next: NextFunction
) => {
  try {
    const userId = await userService.getUserIdByRequest(req);
    const cards = await cardService.getInboxCards(userId);

    return res.status(200).json({ success: true, data: cards });
  } catch (err) {
    next(err);
  }
};

// const addCardToInbox = async (
//   req: Request<CardIdParam>,
//   res: Response<ApiResponse<CardDto[]>>,
//   next: NextFunction
// ) => {
//   try {
//     const userId = await userService.getUserIdByRequest(req);
//     const { cardId } = req.params;
//     const cards = await inboxService.addCardToInbox(userId, cardId);

//     return res.status(201).json({ success: true, data: cards });
//   } catch (err) {
//     next(err);
//   }
// };

export const inboxController = { getInboxCards };
