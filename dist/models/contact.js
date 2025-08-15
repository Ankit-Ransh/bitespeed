"use strict";
/**
 * Contact Model
 *
 * This module provides database operations for the contacts table using raw PostgreSQL queries.
 * It handles creating, finding, and updating contact records in the database.
 *
 * @author Ankit Anand
 * @module models/contact
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const postgres_js_1 = require("../config/postgres.js");
/**
 * ContactModel class provides methods for interacting with the contacts table in the database.
 * It implements all database operations using raw PostgreSQL queries.
 */
class ContactModel {
    /**
     * Find contacts by email or phone number
     *
     * @param email - The email to search for
     * @param phoneNumber - The phone number to search for
     * @returns Promise resolving to an array of Contact objects matching either email or phone number
     */
    static async findByEmailOrPhone(email, phoneNumber) {
        const conditions = [];
        const values = [];
        let paramCount = 1;
        if (email) {
            conditions.push(`email = $${paramCount}`);
            values.push(email);
            paramCount++;
        }
        if (phoneNumber) {
            conditions.push(`phone_number = $${paramCount}`);
            values.push(phoneNumber);
            paramCount++;
        }
        if (conditions.length === 0) {
            return [];
        }
        const whereClause = conditions.join(' OR ');
        const query = `
            SELECT 
                id, 
                phone_number as "phoneNumber", 
                email, 
                linked_id as "linkedId", 
                link_precedence as "linkPrecedence", 
                created_at as "createdAt", 
                updated_at as "updatedAt", 
                deleted_at as "deletedAt"
            FROM contacts 
            WHERE ${whereClause} AND deleted_at IS NULL
            ORDER BY created_at ASC
        `;
        const result = await postgres_js_1.pool.query(query, values);
        return result.rows;
    }
    /**
     * Create a new contact in the database
     *
     * @param data - Object containing contact data (email, phoneNumber, linkedId, linkPrecedence)
     * @returns Promise resolving to the newly created Contact object
     */
    static async create(data) {
        const query = `
            INSERT INTO contacts (
                email, 
                phone_number, 
                linked_id, 
                link_precedence, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, NOW(), NOW()) 
            RETURNING 
                id, 
                phone_number as "phoneNumber", 
                email, 
                linked_id as "linkedId", 
                link_precedence as "linkPrecedence", 
                created_at as "createdAt", 
                updated_at as "updatedAt", 
                deleted_at as "deletedAt"
        `;
        const values = [
            data.email || null,
            data.phoneNumber || null,
            data.linkedId || null,
            data.linkPrecedence
        ];
        const result = await postgres_js_1.pool.query(query, values);
        return result.rows[0];
    }
    /**
     * Find contacts by primary IDs or linked to these primary IDs
     *
     * @param primaryIds - Array of primary contact IDs to search for
     * @returns Promise resolving to an array of Contact objects that match the primary IDs or are linked to the primary IDs
     */
    static async findByPrimaryIds(primaryIds) {
        if (primaryIds.length === 0) {
            return [];
        }
        // Create separate placeholders for each part of the OR condition
        const idPlaceholders = primaryIds.map((_, i) => `$${i + 1}`).join(', ');
        const linkedIdPlaceholders = primaryIds.map((_, i) => `$${i + primaryIds.length + 1}`).join(', ');
        const query = `
            SELECT 
                id, 
                phone_number as "phoneNumber", 
                email, 
                linked_id as "linkedId", 
                link_precedence as "linkPrecedence", 
                created_at as "createdAt", 
                updated_at as "updatedAt", 
                deleted_at as "deletedAt"
            FROM contacts 
            WHERE (id IN (${idPlaceholders}) OR linked_id IN (${linkedIdPlaceholders}))
                AND deleted_at IS NULL
            ORDER BY created_at ASC
        `;
        const values = [...primaryIds, ...primaryIds];
        const result = await postgres_js_1.pool.query(query, values);
        return result.rows;
    }
    /**
     * Find a contact by primary ID and all contacts linked to it
     *
     * @param primaryId - The primary contact ID to search for
     * @returns Promise resolving to an array of Contact objects including the primary and all linked contacts
     */
    static async findByPrimaryId(primaryId) {
        const query = `
            SELECT 
                id, 
                phone_number as "phoneNumber", 
                email, 
                linked_id as "linkedId", 
                link_precedence as "linkPrecedence", 
                created_at as "createdAt", 
                updated_at as "updatedAt", 
                deleted_at as "deletedAt"
            FROM contacts 
            WHERE (id = $1 OR linked_id = $1) AND deleted_at IS NULL
            ORDER BY created_at ASC
        `;
        const result = await postgres_js_1.pool.query(query, [primaryId]);
        return result.rows;
    }
    /**
     * Update a contact in the database
     *
     * @param id - The ID of the contact to update
     * @param data - Object containing contact data to update
     * @returns Promise resolving to the updated Contact object
     */
    static async update(id, data) {
        const updates = [];
        const values = [id];
        let paramCount = 2;
        if (data.linkedId !== undefined) {
            updates.push(`linked_id = $${paramCount}`);
            values.push(data.linkedId);
            paramCount++;
        }
        if (data.linkPrecedence !== undefined) {
            updates.push(`link_precedence = $${paramCount}`);
            values.push(data.linkPrecedence);
            paramCount++;
        }
        if (updates.length === 0) {
            throw new Error('No update fields provided');
        }
        const query = `
            UPDATE contacts 
            SET ${updates.join(', ')}, updated_at = NOW() 
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING 
                id, 
                phone_number as "phoneNumber", 
                email, 
                linked_id as "linkedId", 
                link_precedence as "linkPrecedence", 
                created_at as "createdAt", 
                updated_at as "updatedAt", 
                deleted_at as "deletedAt"
        `;
        const result = await postgres_js_1.pool.query(query, values);
        return result.rows[0];
    }
}
exports.ContactModel = ContactModel;
//# sourceMappingURL=contact.js.map