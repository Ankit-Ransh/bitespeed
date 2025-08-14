import { Request, Response } from "express";
import { identifyContact } from "../controllers/contact.js";
import { IdentifyRequest } from "../controllers/types.js";
import { Constants } from "../utils/constants.js";
import { router } from "./router.js";

router.post(`${Constants.ROUTES.HOME}`, async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body as IdentifyRequest;

    /* 
        Request Body Check
    */
    if (!email && !phoneNumber) {
        res.status(400).json({ error: 'At least one of email or phoneNumber must be provided' });
        return;
    }

    return await identifyContact(req, res);
});

export {
    router as contactRouter
};  