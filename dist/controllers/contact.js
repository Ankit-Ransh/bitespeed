"use strict";
/**
 * Contact Controller
 *
 * This module handles the contact identification logic for the API.
 * It processes requests to identify and link contacts based on email and phone number.
 *
 * @author Ankit Anand
 * @module controllers/contact
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyContact = void 0;
const contact_js_1 = require("../models/contact.js");
const types_js_1 = require("./types.js");
/**
 * Identifies and links contacts based on email and phone number
 *
 * This function implements the core contact identification logic:
 * 1. Searches for contacts matching the provided email or phone number
 * 2. If no matches found, creates a new primary contact
 * 3. If matches found, determines the oldest contact as primary
 * 4. Links any other contacts as secondary to the primary contact
 * 5. Returns consolidated contact information
 *
 * @param req - Express request object containing email and/or phoneNumber
 * @param res - Express response object
 * @returns Promise resolving to void
 */
const identifyContact = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        // Find all contacts that match either email or phoneNumber
        const matchingContacts = await contact_js_1.ContactModel.findByEmailOrPhone(email, phoneNumber);
        // If no contacts found, create a new primary contact
        if (matchingContacts.length === 0) {
            const newContact = await contact_js_1.ContactModel.create({
                email,
                phoneNumber,
                linkedId: null,
                linkPrecedence: types_js_1.LinkPrecedence.PRIMARY
            });
            const response = {
                primaryContatctId: newContact.id,
                emails: email ? [email] : [],
                phoneNumbers: phoneNumber ? [phoneNumber] : [],
                secondaryContactIds: []
            };
            res.status(200).json({ contact: response });
        }
        // Find all related contacts (primary and secondary)
        const primaryIds = new Set();
        const secondaryToCheck = new Set();
        // First pass: collect all primary and secondary IDs
        for (const contact of matchingContacts) {
            if (contact.linkPrecedence === types_js_1.LinkPrecedence.PRIMARY) {
                primaryIds.add(contact.id);
            }
            else {
                if (contact.linkedId) {
                    primaryIds.add(contact.linkedId);
                    secondaryToCheck.add(contact.id);
                }
            }
        }
        // If we have multiple primary contacts, we need to consolidate them
        let oldestPrimaryContact = null;
        let allContacts = [];
        if (primaryIds.size > 0) {
            // Get all contacts related to the primary IDs
            allContacts = await contact_js_1.ContactModel.findByPrimaryIds(Array.from(primaryIds));
            // Find the oldest primary contact
            for (const contact of allContacts) {
                if (contact.linkPrecedence === types_js_1.LinkPrecedence.PRIMARY) {
                    if (!oldestPrimaryContact || contact.createdAt < oldestPrimaryContact.createdAt) {
                        oldestPrimaryContact = contact;
                    }
                }
            }
            // If we have multiple primary contacts, convert newer ones to secondary
            if (primaryIds.size > 1 && oldestPrimaryContact) {
                for (const contact of allContacts) {
                    if (contact.linkPrecedence === types_js_1.LinkPrecedence.PRIMARY &&
                        contact.id !== oldestPrimaryContact.id) {
                        const updatedContact = await contact_js_1.ContactModel.update(contact.id, {
                            linkedId: oldestPrimaryContact.id,
                            linkPrecedence: types_js_1.LinkPrecedence.SECONDARY
                        });
                        contact.linkedId = oldestPrimaryContact.id;
                        contact.linkPrecedence = types_js_1.LinkPrecedence.SECONDARY;
                    }
                }
            }
        }
        // Check if we need to create a new secondary contact
        const existingEmails = new Set(allContacts.map(c => c.email).filter(Boolean));
        const existingPhones = new Set(allContacts.map(c => c.phoneNumber).filter(Boolean));
        let newSecondaryCreated = false;
        if (oldestPrimaryContact &&
            ((email && !existingEmails.has(email)) ||
                (phoneNumber && !existingPhones.has(phoneNumber)))) {
            const newSecondary = await contact_js_1.ContactModel.create({
                email,
                phoneNumber,
                linkedId: oldestPrimaryContact.id,
                linkPrecedence: types_js_1.LinkPrecedence.SECONDARY
            });
            allContacts.push(newSecondary);
            newSecondaryCreated = true;
        }
        // If we created a new secondary or updated contacts, refresh the contact list
        if (newSecondaryCreated || primaryIds.size > 1) {
            if (oldestPrimaryContact) {
                allContacts = await contact_js_1.ContactModel.findByPrimaryId(oldestPrimaryContact.id);
            }
        }
        // Prepare response
        if (oldestPrimaryContact) {
            const emails = Array.from(new Set(allContacts.map(c => c.email).filter(Boolean)));
            const phoneNumbers = Array.from(new Set(allContacts.map(c => c.phoneNumber).filter(Boolean)));
            const secondaryContactIds = allContacts
                .filter(c => c.linkPrecedence === types_js_1.LinkPrecedence.SECONDARY)
                .map(c => c.id);
            // Ensure primary contact's email and phone are first in the lists
            if (oldestPrimaryContact.email && emails.includes(oldestPrimaryContact.email)) {
                const index = emails.indexOf(oldestPrimaryContact.email);
                if (index > 0) {
                    emails.splice(index, 1);
                    emails.unshift(oldestPrimaryContact.email);
                }
            }
            if (oldestPrimaryContact.phoneNumber && phoneNumbers.includes(oldestPrimaryContact.phoneNumber)) {
                const index = phoneNumbers.indexOf(oldestPrimaryContact.phoneNumber);
                if (index > 0) {
                    phoneNumbers.splice(index, 1);
                    phoneNumbers.unshift(oldestPrimaryContact.phoneNumber);
                }
            }
            const response = {
                primaryContatctId: oldestPrimaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds
            };
            res.status(200).json({ contact: response });
        }
        else {
            // This should not happen, but just in case
            res.status(500).json({ error: 'Failed to identify primary contact' });
        }
    }
    catch (error) {
        console.error('Error in identifyContact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.identifyContact = identifyContact;
//# sourceMappingURL=contact.js.map