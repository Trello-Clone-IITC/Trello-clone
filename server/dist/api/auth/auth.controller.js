import { getAuth } from "@clerk/express";
import { authService } from "./auth.service.js";
const checkEmail = async (req, res, next) => {
    try {
        const emailVarificationData = await authService.checkEmail(req.query.email);
        return res.status(200).json({ success: true, data: emailVarificationData });
    }
    catch (err) {
        return next(err);
    }
};
const onBoarding = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        const { firstName, lastName, password } = req.body;
        await authService.onBoarding(userId, firstName, lastName, password);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        return next(err);
    }
};
export const authController = { onBoarding, checkEmail };
