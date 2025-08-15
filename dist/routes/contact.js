"use strict";
/**
 * Contact Routes
 *
 * This module defines the routes for the contact identification API.
 * It handles the POST /identify endpoint for contact identification.
 *
 * @author Ankit Anand
 * @module routes/contact
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const contact_js_1 = require("../controllers/contact.js");
const constants_js_1 = require("../utils/constants.js");
const router_js_1 = require("./router.js");
Object.defineProperty(exports, "contactRouter", { enumerable: true, get: function () { return router_js_1.router; } });
/**
 * POST /identify endpoint
 *
 * Handles requests to identify and consolidate contact information based on email or phone number.
 * Validates that at least one of email or phoneNumber is provided in the request body.
 */
router_js_1.router.post(`${constants_js_1.Constants.ROUTES.HOME}`, async (req, res) => {
    const { email, phoneNumber } = req.body;
    /*
        Request Body Check
    */
    if (!email && !phoneNumber) {
        res.status(400).json({ error: 'At least one of email or phoneNumber must be provided' });
        return;
    }
    return await (0, contact_js_1.identifyContact)(req, res);
});
//# sourceMappingURL=contact.js.map