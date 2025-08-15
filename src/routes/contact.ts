/**
 * Contact Routes
 * 
 * This module defines the routes for the contact identification API.
 * It handles the POST /identify endpoint for contact identification.
 * 
 * @author Ankit Anand
 * @module routes/contact
 */

import { Request, Response } from "express";
import { identifyContact } from "../controllers/contact.js";
import { IdentifyRequest } from "../controllers/types.js";
import { Constants } from "../utils/constants.js";
import { router } from "./router.js";

/**
 * POST /identify endpoint
 * 
 * Handles requests to identify and consolidate contact information based on email or phone number.
 * Validates that at least one of email or phoneNumber is provided in the request body.
 */
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