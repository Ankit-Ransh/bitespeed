import { Request, Response } from 'express';
import { ContactModel } from '../models/contact.js';
import { Contact, ContactResponse, IdentifyRequest, LinkPrecedence } from './types.js';

export const identifyContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, phoneNumber } = req.body as IdentifyRequest;

        // Find all contacts that match either email or phoneNumber
        const matchingContacts = await ContactModel.findByEmailOrPhone(email, phoneNumber);

        // If no contacts found, create a new primary contact
        if (matchingContacts.length === 0) {
            const newContact = await ContactModel.create({
                email,
                phoneNumber,
                linkedId: null,
                linkPrecedence: LinkPrecedence.PRIMARY
            });

            const response: ContactResponse = {
                primaryContatctId: newContact.id,
                emails: email ? [email] : [],
                phoneNumbers: phoneNumber ? [phoneNumber] : [],
                secondaryContactIds: []
            };

            res.status(200).json({ contact: response });
            return;
        }

        // Find all related contacts (primary and secondary)
        const primaryIds = new Set<number>();
        const secondaryToCheck = new Set<number>();

        // First pass: collect all primary and secondary IDs
        for (const contact of matchingContacts) {
            if (contact.linkPrecedence === LinkPrecedence.PRIMARY) {
                primaryIds.add(contact.id);
            } else {
                if (contact.linkedId) {
                    primaryIds.add(contact.linkedId);
                    secondaryToCheck.add(contact.id);
                }
            }
        }

        // If we have multiple primary contacts, we need to consolidate them
        let oldestPrimaryContact: Contact | null = null;
        let allContacts: Contact[] = [];

        if (primaryIds.size > 0) {
            // Get all contacts related to the primary IDs
            allContacts = await ContactModel.findByPrimaryIds(Array.from(primaryIds));

            // Find the oldest primary contact
            for (const contact of allContacts) {
                if (contact.linkPrecedence === LinkPrecedence.PRIMARY) {
                    if (!oldestPrimaryContact || contact.createdAt < oldestPrimaryContact.createdAt) {
                        oldestPrimaryContact = contact;
                    }
                }
            }

            // If we have multiple primary contacts, convert newer ones to secondary
            if (primaryIds.size > 1 && oldestPrimaryContact) {
                for (const contact of allContacts) {
                    if (
                        contact.linkPrecedence === LinkPrecedence.PRIMARY &&
                        contact.id !== oldestPrimaryContact.id
                    ) {
                        const updatedContact = await ContactModel.update(contact.id, {
                            linkedId: oldestPrimaryContact.id,
                            linkPrecedence: LinkPrecedence.SECONDARY
                        });
                        contact.linkedId = oldestPrimaryContact.id;
                        contact.linkPrecedence = LinkPrecedence.SECONDARY;
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

            const newSecondary = await ContactModel.create({
                email,
                phoneNumber,
                linkedId: oldestPrimaryContact.id,
                linkPrecedence: LinkPrecedence.SECONDARY
            });

            allContacts.push(newSecondary);
            newSecondaryCreated = true;
        }

        // If we created a new secondary or updated contacts, refresh the contact list
        if (newSecondaryCreated || primaryIds.size > 1) {
            if (oldestPrimaryContact) {
                allContacts = await ContactModel.findByPrimaryId(oldestPrimaryContact.id);
            }
        }

        // Prepare response
        if (oldestPrimaryContact) {
            const emails = Array.from(
                new Set(allContacts.map(c => c.email).filter(Boolean) as string[])
            );
            const phoneNumbers = Array.from(
                new Set(allContacts.map(c => c.phoneNumber).filter(Boolean) as string[])
            );
            const secondaryContactIds = allContacts
                .filter(c => c.linkPrecedence === LinkPrecedence.SECONDARY)
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

            const response: ContactResponse = {
                primaryContatctId: oldestPrimaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds
            };

            res.status(200).json({ contact: response });
        } else {
            // This should not happen, but just in case
            res.status(500).json({ error: 'Failed to identify primary contact' });
        }
    } catch (error) {
        console.error('Error in identifyContact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}