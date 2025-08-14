import { pool } from '../config/postgres.js';
import { Contact, LinkPrecedence } from '../controllers/types.js';


export class ContactModel {
    /**
     * Find contacts by email or phone number
     */
    static async findByEmailOrPhone(email?: string | null, phoneNumber?: string | null): Promise<Contact[]> {
        const conditions: string[] = [];
        const values: any[] = [];
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
        
        const result = await pool.query(query, values);
        return result.rows;
    }
    
    /**
     * Create a new contact
     */
    static async create(data: {
        email?: string | null;
        phoneNumber?: string | null;
        linkedId?: number | null;
        linkPrecedence: LinkPrecedence;
    }): Promise<Contact> {
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
        
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    
    /**
     * Find contacts by primary ID or linked to primary ID
     */
    static async findByPrimaryIds(primaryIds: number[]): Promise<Contact[]> {
        if (primaryIds.length === 0) {
            return [];
        }
        
        const placeholders = primaryIds.map((_, i) => `$${i + 1}`).join(', ');
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
            WHERE (id IN (${placeholders}) OR linked_id IN (${placeholders}))
                AND deleted_at IS NULL
            ORDER BY created_at ASC
        `;
        
        const values = [...primaryIds, ...primaryIds];
        const result = await pool.query(query, values);
        return result.rows;
    }
    
    /**
     * Find contacts by primary ID and its linked contacts
     */
    static async findByPrimaryId(primaryId: number): Promise<Contact[]> {
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
        
        const result = await pool.query(query, [primaryId]);
        return result.rows;
    }
    
    /**
     * Update a contact
     */
    static async update(id: number, data: {
        linkedId?: number | null;
        linkPrecedence?: LinkPrecedence;
    }): Promise<Contact> {
        const updates: string[] = [];
        const values: any[] = [id];
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
        
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}