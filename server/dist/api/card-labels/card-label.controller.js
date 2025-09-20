import cardLabelService from "./card-label.service.js";
import { userService } from "../users/user.service.js";
import { mapCardLabelToDto } from "./card-label.mapper.js";
import { AppError } from "../../utils/appError.js";
export const cardLabelController = {
    // Add label to card
    addLabelToCard: async (req, res, next) => {
        try {
            const { cardId } = req.params;
            const { labelId } = req.body;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            const cardLabel = await cardLabelService.addLabelToCard(cardId, labelId, userId);
            const cardLabelDto = mapCardLabelToDto(cardLabel);
            res.status(200).json({
                success: true,
                data: cardLabelDto,
            });
        }
        catch (error) {
            if (error instanceof AppError) {
                return next(error);
            }
            return next(new AppError("Failed to add label to card", 500));
        }
    },
    // Remove label from card
    removeLabelFromCard: async (req, res, next) => {
        try {
            const { cardId, labelId } = req.params;
            const userId = (await userService.getUserIdByRequest(req)) ||
                "3f992ec3-fd72-4153-8c8a-9575e5a61867";
            await cardLabelService.removeLabelFromCard(cardId, labelId, userId);
            res.status(200).json({
                success: true,
                message: "Label removed from card successfully",
            });
        }
        catch (error) {
            return next(error);
        }
    },
};
