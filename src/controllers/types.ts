/**
 * Types for Contact Identification API
 * 
 * This module defines the types used throughout the contact identification service.
 * 
 * @author Ankit Anand
 * @module controllers/types
 */

/**
 * Enum representing the precedence of a contact
 * PRIMARY: Original/main contact record
 * SECONDARY: Linked contact record that points to a primary
 */
export enum LinkPrecedence {
    PRIMARY = 'primary',
    SECONDARY = 'secondary'
}

/**
 * Contact type representing a contact record in the database
 */
export type Contact = {
    id: number;
    phoneNumber: string | null;
    email: string | null;
    linkedId: number | null;
    linkPrecedence: LinkPrecedence;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

/**
 * ContactResponse type representing the API response format
 * Contains consolidated contact information including primary and all linked contacts
 */
export type ContactResponse = {
    primaryContatctId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}

/**
 * IdentifyRequest type representing the request body for the identify endpoint
 * At least one of email or phoneNumber must be provided
 */
export type IdentifyRequest = {
    email?: string | null;
    phoneNumber?: string | null;
}
