-- Migration: Create contacts table

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15),
    email VARCHAR(255),
    linked_id INTEGER,
    link_precedence VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (linked_id) REFERENCES contacts(id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_contacts_linked_id ON contacts(linked_id);
CREATE INDEX IF NOT EXISTS idx_contacts_link_precedence ON contacts(link_precedence);
